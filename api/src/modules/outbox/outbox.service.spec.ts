import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OutboxService } from './outbox.service';
import { CoreDatabaseService } from '../../database/core-database.service';
import { CryptoUtil } from '../../common/utils/crypto.util';

describe('OutboxService & Cache Invalidation HMAC', () => {
  let service: OutboxService;
  let coreDbMock: any;

  beforeEach(async () => {
    coreDbMock = {
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxService,
        {
          provide: CoreDatabaseService,
          useValue: coreDbMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'revalidation.hmacSecret') return 'test_secret_hmac_key_12345';
              if (key === 'revalidation.url') return 'http://localhost:3000/api/revalidate';
              if (key === 'revalidation.outboxPollIntervalMs') return 60000;
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OutboxService>(OutboxService);
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an outbox event in database', async () => {
    const eventId = await service.createEvent('cache_invalidation', {
      tags: ['initiatives'],
      paths: ['/initiatives'],
    });

    expect(eventId).toBeDefined();
    expect(coreDbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO outbox_events'),
      expect.arrayContaining([eventId, 'cache_invalidation']),
    );
  });

  it('should compute valid HMAC-SHA256 signature for revalidation payload', () => {
    const secret = 'super_secret_revalidation_key';
    const payload = JSON.stringify({
      eventId: 'evt-123',
      tags: ['content', 'initiatives'],
      timestamp: '2026-09-20T12:00:00.000Z',
    });

    const signature = CryptoUtil.hmacSha256(secret, payload);
    expect(signature).toHaveLength(64); // SHA-256 hex length
    expect(CryptoUtil.safeEqual(signature, CryptoUtil.hmacSha256(secret, payload))).toBe(true);

    // Mismatched secret should fail validation
    const wrongSignature = CryptoUtil.hmacSha256('wrong_secret', payload);
    expect(CryptoUtil.safeEqual(signature, wrongSignature)).toBe(false);
  });

  it('signs the canonical form exactly as gec-web/src/lib/revalidation.ts verifies it (known vector)', () => {
    // These inputs are fixed (not generated at delivery time) so the resulting signature is a
    // reproducible "known vector" we can check against an independently-computed value.
    const secret = 'known_vector_secret';
    const timestamp = '1782000000000';
    const nonce = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    const bodyString = JSON.stringify({
      eventUuid: '99999999-9999-4999-8999-999999999999',
      eventType: 'cache_invalidation',
      tags: ['hero'],
      paths: [],
      timestamp: '2026-09-25T09:00:00.000Z',
    });

    // Canonical string built exactly the way outbox.service.ts#deliverCacheInvalidation builds
    // it: `${timestamp}.${nonce}.${rawBody}`. The api package cannot import gec-web at
    // runtime or in tests, so this is a plain string template, not a shared function - it must
    // be kept in lockstep with deliverCacheInvalidation's own canonicalPayload line by hand.
    const canonical = `${timestamp}.${nonce}.${bodyString}`;
    const signature = CryptoUtil.hmacSha256(secret, canonical);

    // Known vector: independently computed by running gec-web's own
    // `buildCanonicalPayload(timestamp, nonce, bodyString)` + `computeHmacSha256(secret, canonical)`
    // (both exported from gec-web/src/lib/revalidation.ts) against these exact same inputs, via
    // `npx --yes tsx` from gec-web/, on 2026-09-25. See task-2-report.md "Fix round 1" for the
    // script and its output. If this ever needs regenerating, gec-web's functions are the source
    // of truth, not this hardcoded value.
    expect(signature).toBe('dd02dbd7d956604ab20c16abcd57456d47e661395a0daae53c31eb1faa262e59');
  });

  it('delivers cache invalidation with x-gec-signature/timestamp/nonce headers and an eventUuid body', async () => {
    const revalidateUrl = 'https://gec-web.example.com/api/revalidate';
    const hmacSecret = 'test_secret_hmac_key_12345';
    const rowId = '11111111-1111-4111-8111-111111111111';

    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    const originalFetch = (global as any).fetch;
    const originalNodeEnv = process.env.NODE_ENV;
    (global as any).fetch = fetchMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxService,
        {
          provide: CoreDatabaseService,
          useValue: {
            query: jest.fn((sql: string) => {
              if (sql.includes('SELECT')) {
                return Promise.resolve({
                  rows: [
                    {
                      id: rowId,
                      event_type: 'cache_invalidation',
                      payload: JSON.stringify({ tags: ['hero'], paths: [] }),
                      attempts: 0,
                      max_attempts: 5,
                    },
                  ],
                });
              }
              return Promise.resolve({ rows: [], rowCount: 1 });
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'revalidation.hmacSecret') return hmacSecret;
              if (key === 'revalidation.url') return revalidateUrl;
              if (key === 'revalidation.outboxPollIntervalMs') return 60000;
              return null;
            }),
          },
        },
      ],
    }).compile();

    const outboxService = module.get<OutboxService>(OutboxService);

    try {
      // deliverCacheInvalidation short-circuits (skips the real fetch) when
      // NODE_ENV === 'test' or the url contains "localhost" - both true by default under
      // Jest - so this test steps outside NODE_ENV=test to exercise the actual fetch call.
      process.env.NODE_ENV = 'production';
      await outboxService.processOutbox();
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      outboxService.onModuleDestroy();
      (global as any).fetch = originalFetch;
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(revalidateUrl);

    const headers = init.headers as Record<string, string>;
    expect(headers['x-gec-signature']).toEqual(expect.any(String));
    expect(headers['x-gec-timestamp']).toEqual(expect.any(String));
    expect(headers['x-gec-nonce']).toEqual(expect.any(String));
    expect(headers['x-gec-event-id']).toBeUndefined();

    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.eventUuid).toBe(rowId);
    expect(sentBody.eventId).toBeUndefined();
    expect(sentBody.tags).toEqual(['hero']);

    // The signature must equal gec-web's verifier computing the same canonical primary form
    // (`${timestamp}.${nonce}.${rawBody}`, i.e. buildCanonicalPayload + computeHmacSha256 in
    // gec-web/src/lib/revalidation.ts) over the exact headers/body this delivery produced.
    const canonical = `${headers['x-gec-timestamp']}.${headers['x-gec-nonce']}.${init.body}`;
    const expectedSignature = CryptoUtil.hmacSha256(hmacSecret, canonical);
    expect(headers['x-gec-signature']).toBe(expectedSignature);
  });
});

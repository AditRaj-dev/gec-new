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
});

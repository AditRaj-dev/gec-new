import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { v4 as uuidv4 } from 'uuid';

export interface OutboxEvent {
  id: string;
  eventType: string;
  payload: any;
  status: 'pending' | 'processing' | 'delivered' | 'failed';
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: string;
  lastError?: string;
  deliveredAt?: string;
  createdAt: string;
}

@Injectable()
export class OutboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxService.name);
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(
    private coreDb: CoreDatabaseService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const intervalMs = this.configService.get<number>('revalidation.outboxPollIntervalMs') || 5000;
    this.timer = setInterval(() => this.processOutbox(), intervalMs);
    this.logger.log(`Outbox processor initialized with poll interval ${intervalMs}ms.`);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  async createEvent(eventType: string, payload: any): Promise<string> {
    const id = uuidv4();
    await this.coreDb.query(
      `INSERT INTO outbox_events (id, event_type, payload, status, attempts, max_attempts, next_attempt_at, created_at)
       VALUES ($1, $2, $3, 'pending', 0, 5, NOW(), NOW())`,
      [id, eventType, JSON.stringify(payload)],
    );
    return id;
  }

  async processOutbox() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Fetch batch of pending events ready for attempt
      const res = await this.coreDb.query<any>(
        `SELECT * FROM outbox_events 
         WHERE status IN ('pending', 'processing') 
           AND next_attempt_at <= NOW() 
         ORDER BY created_at ASC 
         LIMIT 10`,
      );

      for (const row of res.rows) {
        await this.handleEvent(row);
      }
    } catch (err: any) {
      this.logger.error(`Error processing outbox batch: ${err.message}`, err.stack);
    } finally {
      this.isProcessing = false;
    }
  }

  private async handleEvent(row: any) {
    const eventId = row.id;
    const attempts = (row.attempts || 0) + 1;
    const maxAttempts = row.max_attempts || 5;

    let payload = row.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // use as is
      }
    }

    try {
      if (row.event_type === 'cache_invalidation') {
        await this.deliverCacheInvalidation(eventId, payload);
      }

      // Mark delivered
      await this.coreDb.query(
        `UPDATE outbox_events 
         SET status = 'delivered', attempts = $1, delivered_at = NOW(), last_error = NULL 
         WHERE id = $2`,
        [attempts, eventId],
      );
      this.logger.log(`Outbox event [${eventId}] delivered successfully.`);
    } catch (err: any) {
      this.logger.warn(`Failed to deliver outbox event [${eventId}] (attempt ${attempts}/${maxAttempts}): ${err.message}`);

      if (attempts >= maxAttempts) {
        await this.coreDb.query(
          `UPDATE outbox_events 
           SET status = 'failed', attempts = $1, last_error = $2 
           WHERE id = $3`,
          [attempts, err.message, eventId],
        );
      } else {
        // Exponential backoff with jitter: 2^attempt * 2000ms + random jitter
        const delayMs = Math.pow(2, attempts) * 2000 + Math.floor(Math.random() * 1000);
        const nextAttempt = new Date(Date.now() + delayMs);
        await this.coreDb.query(
          `UPDATE outbox_events 
           SET status = 'pending', attempts = $1, next_attempt_at = $2, last_error = $3 
           WHERE id = $4`,
          [attempts, nextAttempt, err.message, eventId],
        );
      }
    }
  }

  private async deliverCacheInvalidation(eventId: string, payload: any) {
    const revalidationUrl = this.configService.get<string>('revalidation.url');
    const hmacSecret = this.configService.get<string>('revalidation.hmacSecret');

    if (!revalidationUrl || !hmacSecret) {
      this.logger.warn('Revalidation URL or HMAC secret missing. Skipping HTTP request.');
      return;
    }

    // eventId (the outbox row id) is already a uuidv4() value, so it doubles as the
    // "eventUuid" the receiver's schema requires (gec-web/src/lib/revalidation.ts,
    // processRevalidationHandshake step 6: payload.eventUuid must be a non-empty string).
    const bodyString = JSON.stringify({
      eventUuid: eventId,
      eventType: 'cache_invalidation',
      tags: payload.tags || [],
      paths: payload.paths || [],
      timestamp: new Date().toISOString(),
    });

    // A fresh nonce per delivery, tracked by the receiver's NonceTracker to reject replays
    // within its drift window (gec-web/src/lib/revalidation.ts).
    const nonce = uuidv4();
    const timestamp = Date.now().toString();

    // Sign the canonical form the receiver's verifier checks first (and is documented as
    // the "Primary standard" candidate): `${timestamp}.${nonce}.${rawBody}`
    // (buildCanonicalPayload / verifyRevalidationSignature in gec-web/src/lib/revalidation.ts).
    const canonicalPayload = `${timestamp}.${nonce}.${bodyString}`;
    const signature = CryptoUtil.hmacSha256(hmacSecret, canonicalPayload);

    // If url is localhost or mock during tests, avoid actual network errors
    if (revalidationUrl.includes('localhost') || process.env.NODE_ENV === 'test') {
      return;
    }

    const response = await fetch(revalidationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gec-signature': signature,
        'x-gec-timestamp': timestamp,
        'x-gec-nonce': nonce,
      },
      body: bodyString,
    });

    if (!response.ok) {
      throw new Error(`Revalidation endpoint returned HTTP ${response.status}`);
    }
  }
}

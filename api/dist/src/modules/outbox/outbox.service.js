"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OutboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_database_service_1 = require("../../database/core-database.service");
const crypto_util_1 = require("../../common/utils/crypto.util");
const uuid_1 = require("uuid");
let OutboxService = OutboxService_1 = class OutboxService {
    constructor(coreDb, configService) {
        this.coreDb = coreDb;
        this.configService = configService;
        this.logger = new common_1.Logger(OutboxService_1.name);
        this.timer = null;
        this.isProcessing = false;
    }
    onModuleInit() {
        const intervalMs = this.configService.get('revalidation.outboxPollIntervalMs') || 5000;
        this.timer = setInterval(() => this.processOutbox(), intervalMs);
        this.logger.log(`Outbox processor initialized with poll interval ${intervalMs}ms.`);
    }
    onModuleDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    async createEvent(eventType, payload) {
        const id = (0, uuid_1.v4)();
        await this.coreDb.query(`INSERT INTO outbox_events (id, event_type, payload, status, attempts, max_attempts, next_attempt_at, created_at)
       VALUES ($1, $2, $3, 'pending', 0, 5, NOW(), NOW())`, [id, eventType, JSON.stringify(payload)]);
        return id;
    }
    async processOutbox() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        try {
            const res = await this.coreDb.query(`SELECT * FROM outbox_events 
         WHERE status IN ('pending', 'processing') 
           AND next_attempt_at <= NOW() 
         ORDER BY created_at ASC 
         LIMIT 10`);
            for (const row of res.rows) {
                await this.handleEvent(row);
            }
        }
        catch (err) {
            this.logger.error(`Error processing outbox batch: ${err.message}`, err.stack);
        }
        finally {
            this.isProcessing = false;
        }
    }
    async handleEvent(row) {
        const eventId = row.id;
        const attempts = (row.attempts || 0) + 1;
        const maxAttempts = row.max_attempts || 5;
        let payload = row.payload;
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            }
            catch {
            }
        }
        try {
            if (row.event_type === 'cache_invalidation') {
                await this.deliverCacheInvalidation(eventId, payload);
            }
            await this.coreDb.query(`UPDATE outbox_events 
         SET status = 'delivered', attempts = $1, delivered_at = NOW(), last_error = NULL 
         WHERE id = $2`, [attempts, eventId]);
            this.logger.log(`Outbox event [${eventId}] delivered successfully.`);
        }
        catch (err) {
            this.logger.warn(`Failed to deliver outbox event [${eventId}] (attempt ${attempts}/${maxAttempts}): ${err.message}`);
            if (attempts >= maxAttempts) {
                await this.coreDb.query(`UPDATE outbox_events 
           SET status = 'failed', attempts = $1, last_error = $2 
           WHERE id = $3`, [attempts, err.message, eventId]);
            }
            else {
                const delayMs = Math.pow(2, attempts) * 2000 + Math.floor(Math.random() * 1000);
                const nextAttempt = new Date(Date.now() + delayMs);
                await this.coreDb.query(`UPDATE outbox_events 
           SET status = 'pending', attempts = $1, next_attempt_at = $2, last_error = $3 
           WHERE id = $4`, [attempts, nextAttempt, err.message, eventId]);
            }
        }
    }
    async deliverCacheInvalidation(eventId, payload) {
        const revalidationUrl = this.configService.get('revalidation.url');
        const hmacSecret = this.configService.get('revalidation.hmacSecret');
        if (!revalidationUrl || !hmacSecret) {
            this.logger.warn('Revalidation URL or HMAC secret missing. Skipping HTTP request.');
            return;
        }
        const bodyString = JSON.stringify({
            eventId,
            eventType: 'cache_invalidation',
            tags: payload.tags || [],
            paths: payload.paths || [],
            timestamp: new Date().toISOString(),
        });
        const signature = crypto_util_1.CryptoUtil.hmacSha256(hmacSecret, bodyString);
        if (revalidationUrl.includes('localhost') || process.env.NODE_ENV === 'test') {
            return;
        }
        const response = await fetch(revalidationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-gec-signature': signature,
                'x-gec-event-id': eventId,
                'x-gec-timestamp': Date.now().toString(),
            },
            body: bodyString,
        });
        if (!response.ok) {
            throw new Error(`Revalidation endpoint returned HTTP ${response.status}`);
        }
    }
};
exports.OutboxService = OutboxService;
exports.OutboxService = OutboxService = OutboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        config_1.ConfigService])
], OutboxService);
//# sourceMappingURL=outbox.service.js.map
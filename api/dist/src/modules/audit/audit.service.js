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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
let AuditService = AuditService_1 = class AuditService {
    constructor(coreDb) {
        this.coreDb = coreDb;
        this.logger = new common_1.Logger(AuditService_1.name);
    }
    async log(input) {
        const id = (0, uuid_1.v4)();
        try {
            await this.coreDb.query(`INSERT INTO audit_logs (id, actor_id, action, resource_type, resource_id, request_id, ip_address, details, content_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [
                id,
                input.actorId || null,
                input.action,
                input.resourceType,
                input.resourceId || null,
                input.requestId || null,
                input.ipAddress || null,
                JSON.stringify(input.details || {}),
                input.contentHash || null,
            ]);
        }
        catch (err) {
            this.logger.error(`Failed to record audit log: ${err.message}`, err.stack);
        }
        return id;
    }
    async queryLogs(filter) {
        const limit = filter.limit || 50;
        const res = await this.coreDb.query(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1`, [limit]);
        return res.rows;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService])
], AuditService);
//# sourceMappingURL=audit.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
const audit_service_1 = require("../audit/audit.service");
let SubmissionsService = class SubmissionsService {
    constructor(coreDb, auditService) {
        this.coreDb = coreDb;
        this.auditService = auditService;
    }
    async createPublic(dto) {
        const id = (0, uuid_1.v4)();
        await this.coreDb.query(`INSERT INTO submissions (id, submission_type, target_entity_id, applicant_name, applicant_email, applicant_phone, status, payload, attachment_keys, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'submitted', $7, $8, NOW(), NOW())`, [
            id,
            dto.submissionType,
            dto.targetEntityId || null,
            dto.applicantName,
            dto.applicantEmail,
            dto.applicantPhone || null,
            JSON.stringify(dto.payload),
            JSON.stringify(dto.attachmentKeys || []),
        ]);
        return {
            success: true,
            submissionId: id,
            message: 'Submission received successfully. Our team will review your application.',
        };
    }
    async list(filter) {
        const limit = filter.limit || 100;
        const res = await this.coreDb.query(`SELECT * FROM submissions ORDER BY created_at DESC LIMIT $1`, [limit]);
        let items = res.rows;
        if (filter.submissionType) {
            items = items.filter((s) => s.submission_type === filter.submissionType);
        }
        if (filter.status) {
            items = items.filter((s) => s.status === filter.status);
        }
        return items;
    }
    async get(id) {
        const res = await this.coreDb.query('SELECT * FROM submissions WHERE id = $1', [id]);
        const item = res.rows[0];
        if (!item) {
            throw new common_1.NotFoundException(`Submission '${id}' not found.`);
        }
        return item;
    }
    async updateStatus(id, dto, actorId) {
        const existing = await this.get(id);
        await this.coreDb.query(`UPDATE submissions SET status = $1, updated_at = NOW() WHERE id = $2`, [dto.status, id]);
        await this.auditService.log({
            actorId,
            action: 'submission.update_status',
            resourceType: 'submission',
            resourceId: id,
            details: { previousStatus: existing.status, newStatus: dto.status, note: dto.note },
        });
        return { success: true, status: dto.status };
    }
    async exportCsv(submissionType) {
        const items = await this.list({ submissionType, limit: 1000 });
        const headers = ['ID', 'Type', 'Applicant Name', 'Applicant Email', 'Phone', 'Status', 'Submitted At'];
        const rows = items.map((s) => [
            s.id,
            s.submission_type,
            `"${(s.applicant_name || '').replace(/"/g, '""')}"`,
            `"${(s.applicant_email || '').replace(/"/g, '""')}"`,
            `"${(s.applicant_phone || '').replace(/"/g, '""')}"`,
            s.status,
            new Date(s.created_at).toISOString(),
        ]);
        return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        audit_service_1.AuditService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map
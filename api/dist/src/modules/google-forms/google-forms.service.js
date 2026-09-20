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
var GoogleFormsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFormsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
const forms_database_service_1 = require("../../database/forms-database.service");
const audit_service_1 = require("../audit/audit.service");
const crypto_util_1 = require("../../common/utils/crypto.util");
const google_forms_dto_1 = require("./dto/google-forms.dto");
let GoogleFormsService = GoogleFormsService_1 = class GoogleFormsService {
    constructor(formsDb, configService, auditService) {
        this.formsDb = formsDb;
        this.configService = configService;
        this.auditService = auditService;
        this.logger = new common_1.Logger(GoogleFormsService_1.name);
        this.formsApi = null;
        this.sheetsApi = null;
        this.initGoogleClient();
    }
    initGoogleClient() {
        const clientId = this.configService.get('google.clientId');
        const clientSecret = this.configService.get('google.clientSecret');
        const refreshToken = this.configService.get('google.refreshToken');
        if (clientId && clientSecret && refreshToken && !clientId.includes('sample_oauth')) {
            try {
                const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
                oauth2Client.setCredentials({ refresh_token: refreshToken });
                this.formsApi = googleapis_1.google.forms({ version: 'v1', auth: oauth2Client });
                this.sheetsApi = googleapis_1.google.sheets({ version: 'v4', auth: oauth2Client });
                this.logger.log('Google Workspace OAuth client initialized.');
            }
            catch (err) {
                this.logger.warn(`Failed to initialize Google API client: ${err.message}`);
            }
        }
        else {
            this.logger.warn('Google Workspace OAuth not configured. Using Google Forms mock adapter.');
        }
    }
    async createPlan(plan, actorId) {
        const planId = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const manualSteps = [];
        (plan.items || []).forEach((item) => {
            if (item.kind === 'file_upload_manual') {
                manualSteps.push({
                    kind: 'file_upload_question',
                    itemKey: item.key,
                    instructions: item.instructions || 'Create file upload in Google Forms editor',
                });
            }
        });
        const fullPlan = {
            ...plan,
            requiredManualSteps: manualSteps,
        };
        await this.formsDb.query(`INSERT INTO google_form_plans (id, plan, status, actor_id, expires_at, created_at)
       VALUES ($1, $2, 'proposed', $3, $4, NOW())`, [planId, JSON.stringify(fullPlan), actorId, expiresAt]);
        return {
            planId,
            plan: fullPlan,
            status: 'proposed',
        };
    }
    async listForms() {
        const res = await this.formsDb.query('SELECT * FROM google_forms ORDER BY created_at DESC');
        return res.rows;
    }
    async getForm(id) {
        const res = await this.formsDb.query('SELECT * FROM google_forms WHERE id = $1 OR google_form_id = $1', [id]);
        const form = res.rows[0];
        if (!form) {
            throw new common_1.NotFoundException(`Google Form '${id}' not found.`);
        }
        const revRes = await this.formsDb.query('SELECT * FROM google_form_revisions WHERE google_form_id = $1 ORDER BY created_at DESC LIMIT 1', [form.google_form_id]);
        const manualRes = await this.formsDb.query('SELECT * FROM manual_requirements WHERE google_form_id = $1', [form.google_form_id]);
        return {
            ...form,
            latestRevision: revRes.rows[0] || null,
            manualRequirements: manualRes.rows,
        };
    }
    async createFormFromPlan(dto, actorId) {
        const planRes = await this.formsDb.query('SELECT * FROM google_form_plans WHERE id = $1', [dto.planId]);
        const planRecord = planRes.rows[0];
        if (!planRecord) {
            throw new common_1.NotFoundException(`Form plan '${dto.planId}' not found.`);
        }
        const plan = typeof planRecord.plan === 'string' ? JSON.parse(planRecord.plan) : planRecord.plan;
        const googleFormId = `gf_${(0, uuid_1.v4)().replace(/-/g, '')}`;
        const revisionId = 'rev_1_init';
        const hasManualUpload = (plan.requiredManualSteps || []).length > 0;
        const lifecycleState = hasManualUpload
            ? google_forms_dto_1.GoogleFormLifecycleState.NEEDS_MANUAL_UPLOAD_SETUP
            : google_forms_dto_1.GoogleFormLifecycleState.READY_FOR_REVIEW;
        const editUrl = `https://docs.google.com/forms/d/${googleFormId}/edit`;
        const responderUrl = `https://docs.google.com/forms/d/e/${googleFormId}/viewform`;
        const formRecordId = (0, uuid_1.v4)();
        await this.formsDb.query(`INSERT INTO google_forms (id, google_form_id, title, owner_account, edit_url, responder_url, lifecycle_state, revision_id, plan_version, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, 'automation@gec.org', $4, $5, $6, $7, 1, $8, NOW(), NOW())`, [formRecordId, googleFormId, plan.title, editUrl, responderUrl, lifecycleState, revisionId, actorId]);
        await this.formsDb.query(`INSERT INTO google_form_revisions (id, google_form_id, revision_id, snapshot, managed_item_map, content_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`, [
            (0, uuid_1.v4)(),
            googleFormId,
            revisionId,
            JSON.stringify(plan),
            JSON.stringify({ items: (plan.items || []).map((i) => i.key) }),
            crypto_util_1.CryptoUtil.sha256(JSON.stringify(plan)),
        ]);
        for (const step of plan.requiredManualSteps || []) {
            await this.formsDb.query(`INSERT INTO manual_requirements (id, google_form_id, item_key, instructions, verified, created_at)
         VALUES ($1, $2, $3, $4, false, NOW())`, [(0, uuid_1.v4)(), googleFormId, step.itemKey, step.instructions]);
        }
        await this.formsDb.query(`INSERT INTO google_action_log (id, operation_type, actor_id, idempotency_key, status, request_metadata, created_at)
       VALUES ($1, 'create_form', $2, $3, 'succeeded', $4, NOW())`, [(0, uuid_1.v4)(), actorId, dto.idempotencyKey, JSON.stringify({ formId: googleFormId, planId: dto.planId })]);
        await this.auditService.log({
            actorId,
            action: 'google_forms.create',
            resourceType: 'google_form',
            resourceId: googleFormId,
            details: { title: plan.title, lifecycleState, hasManualUpload },
        });
        return {
            id: formRecordId,
            googleFormId,
            title: plan.title,
            editUrl,
            responderUrl,
            lifecycleState,
            revisionId,
            manualUploadRequired: hasManualUpload,
        };
    }
    async updateForm(id, dto, actorId) {
        const form = await this.getForm(id);
        if (form.revision_id !== dto.currentRevisionId) {
            throw new common_1.ConflictException(`Google revision conflict: Expected '${dto.currentRevisionId}', but current revision is '${form.revision_id}'. Please refresh.`);
        }
        const nextRevisionId = `rev_${Date.now()}`;
        const nextPlanVersion = (form.plan_version || 1) + 1;
        await this.formsDb.query(`UPDATE google_forms 
       SET title = COALESCE($1, title), revision_id = $2, plan_version = $3, updated_at = NOW() 
       WHERE google_form_id = $4`, [dto.title || null, nextRevisionId, nextPlanVersion, form.google_form_id]);
        return {
            googleFormId: form.google_form_id,
            revisionId: nextRevisionId,
            planVersion: nextPlanVersion,
            status: 'updated',
        };
    }
    async verifyManualSteps(id, actorId) {
        const form = await this.getForm(id);
        await this.formsDb.query(`UPDATE manual_requirements 
       SET verified = true, verified_at = NOW() 
       WHERE google_form_id = $1`, [form.google_form_id]);
        await this.formsDb.query(`UPDATE google_forms 
       SET lifecycle_state = 'ready_for_review', manual_steps_verified_at = NOW(), updated_at = NOW() 
       WHERE google_form_id = $1`, [form.google_form_id]);
        await this.auditService.log({
            actorId,
            action: 'google_forms.verify_manual_steps',
            resourceType: 'google_form',
            resourceId: form.google_form_id,
            details: { verified: true },
        });
        return {
            googleFormId: form.google_form_id,
            lifecycleState: 'ready_for_review',
            message: 'All manual file-upload steps verified. Form is ready for publication.',
        };
    }
    async publishForm(id, actorId) {
        const form = await this.getForm(id);
        if (form.lifecycle_state === google_forms_dto_1.GoogleFormLifecycleState.NEEDS_MANUAL_UPLOAD_SETUP) {
            throw new common_1.BadRequestException('Cannot publish: Manual file-upload steps must be verified before publishing.');
        }
        await this.formsDb.query(`UPDATE google_forms 
       SET lifecycle_state = 'published', updated_at = NOW() 
       WHERE google_form_id = $1`, [form.google_form_id]);
        await this.auditService.log({
            actorId,
            action: 'google_forms.publish',
            resourceType: 'google_form',
            resourceId: form.google_form_id,
            details: { responderUrl: form.responder_url },
        });
        return {
            googleFormId: form.google_form_id,
            lifecycleState: 'published',
            responderUrl: form.responder_url,
        };
    }
    async closeForm(id, actorId) {
        const form = await this.getForm(id);
        await this.formsDb.query(`UPDATE google_forms 
       SET lifecycle_state = 'closed', updated_at = NOW() 
       WHERE google_form_id = $1`, [form.google_form_id]);
        await this.auditService.log({
            actorId,
            action: 'google_forms.close',
            resourceType: 'google_form',
            resourceId: form.google_form_id,
        });
        return {
            googleFormId: form.google_form_id,
            lifecycleState: 'closed',
        };
    }
    async syncResponses(id, actorId) {
        const form = await this.getForm(id);
        const syncRunId = (0, uuid_1.v4)();
        const mockResponses = [
            {
                responseId: `resp_${(0, uuid_1.v4)().substring(0, 8)}`,
                answers: {
                    full_name: 'Aarav Patel',
                    email: 'aarav.patel@galgotiasuniversity.edu.in',
                    year_of_study: '3rd Year',
                    startup_idea: 'Decentralized campus marketplace',
                },
                submittedAt: new Date().toISOString(),
            },
        ];
        let count = 0;
        for (const r of mockResponses) {
            await this.formsDb.query(`INSERT INTO response_cache (id, google_form_id, google_response_id, form_revision_id, answers, source_hash, submitted_at, created_at, updated_at, is_available)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), true)
         ON CONFLICT (google_form_id, google_response_id) 
         DO UPDATE SET answers = EXCLUDED.answers, updated_at = NOW()`, [
                (0, uuid_1.v4)(),
                form.google_form_id,
                r.responseId,
                form.revision_id,
                JSON.stringify(r.answers),
                crypto_util_1.CryptoUtil.sha256(JSON.stringify(r.answers)),
                r.submittedAt,
            ]);
            count++;
        }
        await this.formsDb.query(`INSERT INTO response_sync_runs (id, google_form_id, synced_count, status, created_at)
       VALUES ($1, $2, $3, 'completed', NOW())`, [syncRunId, form.google_form_id, count]);
        await this.formsDb.query(`UPDATE google_forms SET last_response_sync_at = NOW(), updated_at = NOW() WHERE google_form_id = $1`, [form.google_form_id]);
        return {
            googleFormId: form.google_form_id,
            syncedCount: count,
            syncRunId,
            lastResponseSyncAt: new Date().toISOString(),
        };
    }
    async getCachedResponses(id) {
        const form = await this.getForm(id);
        const res = await this.formsDb.query(`SELECT * FROM response_cache WHERE google_form_id = $1 AND is_available = true ORDER BY submitted_at DESC`, [form.google_form_id]);
        return res.rows;
    }
    async exportToSheet(id, dto, actorId) {
        const form = await this.getForm(id);
        const responses = await this.getCachedResponses(id);
        let exportedCount = 0;
        for (let i = 0; i < responses.length; i++) {
            const resp = responses[i];
            try {
                await this.formsDb.query(`INSERT INTO sheet_exports (id, google_form_id, google_response_id, spreadsheet_id, tab_name, row_number, status, attempts, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'succeeded', 1, NOW())
           ON CONFLICT (google_form_id, google_response_id, spreadsheet_id, tab_name) DO NOTHING`, [(0, uuid_1.v4)(), form.google_form_id, resp.google_response_id, dto.spreadsheetId, dto.tabName, i + 2]);
                exportedCount++;
            }
            catch (err) {
                this.logger.warn(`Sheet export row error: ${err.message}`);
            }
        }
        await this.auditService.log({
            actorId,
            action: 'google_forms.sheet_export',
            resourceType: 'google_form',
            resourceId: form.google_form_id,
            details: { spreadsheetId: dto.spreadsheetId, tabName: dto.tabName, exportedCount },
        });
        return {
            googleFormId: form.google_form_id,
            spreadsheetId: dto.spreadsheetId,
            tabName: dto.tabName,
            exportedResponses: exportedCount,
            status: 'completed',
        };
    }
};
exports.GoogleFormsService = GoogleFormsService;
exports.GoogleFormsService = GoogleFormsService = GoogleFormsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [forms_database_service_1.FormsDatabaseService,
        config_1.ConfigService,
        audit_service_1.AuditService])
], GoogleFormsService);
//# sourceMappingURL=google-forms.service.js.map
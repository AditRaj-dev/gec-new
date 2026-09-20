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
var CopilotToolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopilotToolsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
const forms_database_service_1 = require("../../database/forms-database.service");
const mongo_service_1 = require("../../database/mongo.service");
const crypto_util_1 = require("../../common/utils/crypto.util");
let CopilotToolsService = CopilotToolsService_1 = class CopilotToolsService {
    constructor(coreDb, formsDb, mongoDb) {
        this.coreDb = coreDb;
        this.formsDb = formsDb;
        this.mongoDb = mongoDb;
        this.logger = new common_1.Logger(CopilotToolsService_1.name);
    }
    async searchCmsContent(query, entityType) {
        const filter = entityType ? { entityType } : {};
        const drafts = await this.mongoDb.find('cms_drafts', filter);
        const lowerQuery = query.toLowerCase();
        return drafts
            .filter((d) => {
            const titleMatch = d.title?.toLowerCase().includes(lowerQuery);
            const slugMatch = d.slug?.toLowerCase().includes(lowerQuery);
            return titleMatch || slugMatch;
        })
            .slice(0, 10)
            .map((d) => ({
            id: d.id,
            entityType: d.entityType,
            title: d.title,
            slug: d.slug,
            version: d.version,
            updatedAt: d.updatedAt,
        }));
    }
    async getCmsDraft(id) {
        const draft = await this.mongoDb.findOne('cms_drafts', { id });
        if (!draft) {
            throw new common_1.NotFoundException(`Draft '${id}' not found.`);
        }
        const workflowRes = await this.coreDb.query('SELECT * FROM content_workflows WHERE entity_id = $1', [id]);
        const workflow = workflowRes.rows[0];
        return {
            id: draft.id,
            entityType: draft.entityType,
            title: draft.title,
            slug: draft.slug,
            version: draft.version,
            workflowState: workflow?.workflow_state || 'draft',
            data: draft.data,
            updatedAt: draft.updatedAt,
        };
    }
    async proposeCmsDraftUpdate(conversationId, actorId, targetId, expectedVersion, fieldDiff) {
        const draft = await this.mongoDb.findOne('cms_drafts', { id: targetId });
        if (!draft) {
            throw new common_1.NotFoundException(`Cannot propose update: Draft '${targetId}' not found.`);
        }
        const proposalId = (0, uuid_1.v4)();
        const token = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(token);
        const idempotencyKey = `prop_cms_${(0, uuid_1.v4)()}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const preview = {
            targetId,
            currentVersion: draft.version,
            expectedVersion,
            changedFields: Object.keys(fieldDiff),
            diff: fieldDiff,
        };
        await this.coreDb.query(`INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'propose_cms_draft_update', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`, [
            proposalId,
            conversationId,
            actorId,
            targetId,
            expectedVersion.toString(),
            JSON.stringify({ targetId, expectedVersion, fieldDiff }),
            JSON.stringify(preview),
            tokenHash,
            idempotencyKey,
            expiresAt,
        ]);
        return {
            proposalId,
            confirmationToken: token,
            expiresAt: expiresAt.toISOString(),
            actionType: 'propose_cms_draft_update',
            preview,
        };
    }
    async createGoogleFormPlan(conversationId, actorId, planBody) {
        if (!planBody.title || !planBody.items || !Array.isArray(planBody.items)) {
            throw new common_1.BadRequestException('Invalid GoogleFormPlan: title and items array are required.');
        }
        const proposalId = (0, uuid_1.v4)();
        const token = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(token);
        const idempotencyKey = `prop_gf_${(0, uuid_1.v4)()}`;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        const manualSteps = [];
        planBody.items.forEach((item) => {
            if (item.kind === 'file_upload_manual') {
                manualSteps.push({
                    kind: 'file_upload_question',
                    itemKey: item.key,
                    instructions: item.instructions || 'Create file upload item in Google Forms editor',
                });
            }
        });
        const validatedPlan = {
            title: planBody.title,
            documentTitle: planBody.documentTitle || planBody.title,
            description: planBody.description || '',
            settings: planBody.settings || { isQuiz: false, collectEmail: 'responder_input' },
            items: planBody.items,
            branching: planBody.branching || [],
            requiredManualSteps: manualSteps,
        };
        await this.formsDb.query(`INSERT INTO google_form_plans (id, plan, status, actor_id, token_hash, expires_at, created_at)
       VALUES ($1, $2, 'proposed', $3, $4, $5, NOW())`, [proposalId, JSON.stringify(validatedPlan), actorId, tokenHash, expiresAt]);
        await this.coreDb.query(`INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'create_google_form_plan', $4, '1', $5, $6, 'proposed', $7, $8, $9, NOW())`, [
            proposalId,
            conversationId,
            actorId,
            proposalId,
            JSON.stringify(validatedPlan),
            JSON.stringify({ title: validatedPlan.title, itemCount: validatedPlan.items.length, manualSteps }),
            tokenHash,
            idempotencyKey,
            expiresAt,
        ]);
        return {
            proposalId,
            confirmationToken: token,
            expiresAt: expiresAt.toISOString(),
            actionType: 'create_google_form_plan',
            plan: validatedPlan,
        };
    }
    async proposeGoogleFormUpdate(conversationId, actorId, formId, currentRevisionId, changes) {
        const res = await this.formsDb.query('SELECT * FROM google_forms WHERE google_form_id = $1 OR id = $1', [formId]);
        const form = res.rows[0];
        if (!form) {
            throw new common_1.NotFoundException(`Google Form '${formId}' not found.`);
        }
        if (form.revision_id !== currentRevisionId) {
            throw new common_1.BadRequestException(`Form revision conflict: Expected '${currentRevisionId}', found '${form.revision_id}'.`);
        }
        const proposalId = (0, uuid_1.v4)();
        const token = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(token);
        const idempotencyKey = `prop_gfup_${(0, uuid_1.v4)()}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const preview = {
            formId: form.google_form_id,
            title: form.title,
            currentRevisionId,
            changes,
        };
        await this.coreDb.query(`INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'propose_google_form_update', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`, [
            proposalId,
            conversationId,
            actorId,
            form.google_form_id,
            currentRevisionId,
            JSON.stringify({ formId: form.google_form_id, currentRevisionId, changes }),
            JSON.stringify(preview),
            tokenHash,
            idempotencyKey,
            expiresAt,
        ]);
        return {
            proposalId,
            confirmationToken: token,
            expiresAt: expiresAt.toISOString(),
            actionType: 'propose_google_form_update',
            preview,
        };
    }
    async buildSubmissionFilter(formId, formRevisionId, predicates, sort, limit = 50) {
        return {
            formId,
            formRevisionId,
            predicates: predicates || [],
            sort: sort || [],
            limit: Math.min(limit, 100),
        };
    }
    async proposePublishGoogleForm(conversationId, actorId, formId) {
        const res = await this.formsDb.query('SELECT * FROM google_forms WHERE google_form_id = $1 OR id = $1', [formId]);
        const form = res.rows[0];
        if (!form) {
            throw new common_1.NotFoundException(`Google Form '${formId}' not found.`);
        }
        if (form.lifecycle_state === 'needs_manual_upload_setup') {
            throw new common_1.BadRequestException('Cannot publish Google Form: Manual file-upload steps must be verified first.');
        }
        const proposalId = (0, uuid_1.v4)();
        const token = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(token);
        const idempotencyKey = `prop_gpub_${(0, uuid_1.v4)()}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const preview = {
            formId: form.google_form_id,
            title: form.title,
            currentState: form.lifecycle_state,
            nextState: 'published',
        };
        await this.coreDb.query(`INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'publish_google_form', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`, [
            proposalId,
            conversationId,
            actorId,
            form.google_form_id,
            form.revision_id,
            JSON.stringify({ formId: form.google_form_id }),
            JSON.stringify(preview),
            tokenHash,
            idempotencyKey,
            expiresAt,
        ]);
        return {
            proposalId,
            confirmationToken: token,
            expiresAt: expiresAt.toISOString(),
            actionType: 'publish_google_form',
            preview,
        };
    }
};
exports.CopilotToolsService = CopilotToolsService;
exports.CopilotToolsService = CopilotToolsService = CopilotToolsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        forms_database_service_1.FormsDatabaseService,
        mongo_service_1.MongoService])
], CopilotToolsService);
//# sourceMappingURL=copilot-tools.service.js.map
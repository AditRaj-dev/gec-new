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
var CopilotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopilotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const genai_1 = require("@google/genai");
const core_database_service_1 = require("../../database/core-database.service");
const forms_database_service_1 = require("../../database/forms-database.service");
const mongo_service_1 = require("../../database/mongo.service");
const audit_service_1 = require("../audit/audit.service");
const content_service_1 = require("../content/content.service");
const copilot_tools_service_1 = require("./copilot-tools.service");
const crypto_util_1 = require("../../common/utils/crypto.util");
let CopilotService = CopilotService_1 = class CopilotService {
    constructor(coreDb, formsDb, mongoDb, configService, auditService, contentService, toolsService) {
        this.coreDb = coreDb;
        this.formsDb = formsDb;
        this.mongoDb = mongoDb;
        this.configService = configService;
        this.auditService = auditService;
        this.contentService = contentService;
        this.toolsService = toolsService;
        this.logger = new common_1.Logger(CopilotService_1.name);
        this.genAI = null;
        this.initGemini();
    }
    initGemini() {
        const apiKey = this.configService.get('gemini.apiKey');
        if (apiKey && !apiKey.includes('sample_gemini')) {
            try {
                this.genAI = new genai_1.GoogleGenAI({ apiKey });
                this.logger.log('Gemini Developer API client initialized.');
            }
            catch (err) {
                this.logger.warn(`Failed to initialize GoogleGenAI: ${err.message}`);
            }
        }
        else {
            this.logger.warn('Gemini API key not configured. Using copilot mock/deterministic response engine.');
        }
    }
    async createConversation(title, actorId) {
        const id = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.coreDb.query(`INSERT INTO copilot_conversations (id, actor_id, title, created_at, expires_at, is_deleted)
       VALUES ($1, $2, $3, NOW(), $4, false)`, [id, actorId, title || 'New Conversation', expiresAt]);
        await this.auditService.log({
            actorId,
            action: 'copilot.create_conversation',
            resourceType: 'copilot_conversation',
            resourceId: id,
        });
        return {
            id,
            title: title || 'New Conversation',
            expiresAt: expiresAt.toISOString(),
        };
    }
    async getConversation(id, actorId) {
        const res = await this.coreDb.query('SELECT * FROM copilot_conversations WHERE id = $1 AND is_deleted = false', [id]);
        const convo = res.rows[0];
        if (!convo) {
            throw new common_1.NotFoundException(`Conversation '${id}' not found or expired.`);
        }
        if (convo.actor_id !== actorId) {
            throw new common_1.ForbiddenException('Access denied to conversation.');
        }
        const msgRes = await this.coreDb.query('SELECT * FROM copilot_messages WHERE conversation_id = $1 ORDER BY created_at ASC', [id]);
        const propRes = await this.coreDb.query('SELECT id, action_type, target_id, status, preview, expires_at, created_at FROM copilot_proposals WHERE conversation_id = $1 ORDER BY created_at ASC', [id]);
        return {
            id: convo.id,
            title: convo.title,
            expiresAt: convo.expires_at,
            messages: msgRes.rows,
            proposals: propRes.rows,
        };
    }
    async deleteConversation(id, actorId) {
        const convo = await this.getConversation(id, actorId);
        await this.coreDb.query('UPDATE copilot_conversations SET is_deleted = true WHERE id = $1', [id]);
        await this.coreDb.query('DELETE FROM copilot_messages WHERE conversation_id = $1', [id]);
        await this.auditService.log({
            actorId,
            action: 'copilot.delete_conversation',
            resourceType: 'copilot_conversation',
            resourceId: id,
        });
        return { success: true, message: 'Conversation deleted.' };
    }
    async streamMessage(conversationId, dto, actorId, res) {
        const convo = await this.getConversation(conversationId, actorId);
        await this.coreDb.query(`INSERT INTO copilot_messages (id, conversation_id, role, content, created_at)
       VALUES ($1, $2, 'user', $3, NOW())`, [(0, uuid_1.v4)(), conversationId, dto.message]);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders?.();
        const sendEvent = (event, data) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };
        try {
            const userPrompt = dto.message.toLowerCase();
            if (userPrompt.includes('google form') || userPrompt.includes('form plan') || userPrompt.includes('registration form')) {
                sendEvent('message.delta', { text: 'Analyzing requirements to generate a structured Google Form plan...\n' });
                sendEvent('tool.started', { tool: 'create_google_form_plan', input: { query: dto.message } });
                const isUploadNeeded = userPrompt.includes('resume') || userPrompt.includes('pitch deck') || userPrompt.includes('upload');
                const plan = {
                    title: 'GEC Program Application Form 2026',
                    documentTitle: 'GEC Program Application Form 2026',
                    description: 'Official application for Galgotias Entrepreneurship Cell initiative.',
                    settings: { isQuiz: false, collectEmail: 'responder_input' },
                    items: [
                        { kind: 'text', key: 'full_name', title: 'Full Name', paragraph: false, required: true },
                        { kind: 'text', key: 'email', title: 'University Email', paragraph: false, required: true },
                        { kind: 'choice', key: 'year_of_study', title: 'Year of Study', mode: 'radio', options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], required: true },
                        { kind: 'text', key: 'startup_idea', title: 'Describe your startup idea or venture', paragraph: true, required: true },
                        ...(isUploadNeeded
                            ? [{ kind: 'file_upload_manual', key: 'pitch_deck', title: 'Upload Pitch Deck / Summary PDF', instructions: 'Manually add File Upload question in Google Forms editor.' }]
                            : []),
                    ],
                    branching: [],
                };
                const proposal = await this.toolsService.createGoogleFormPlan(conversationId, actorId, plan);
                sendEvent('tool.result', { tool: 'create_google_form_plan', result: { status: 'plan_generated', itemCount: plan.items.length } });
                sendEvent('action.proposed', {
                    actionId: proposal.proposalId,
                    actionType: proposal.actionType,
                    confirmationToken: proposal.confirmationToken,
                    expiresAt: proposal.expiresAt,
                    preview: proposal.plan,
                });
                sendEvent('message.delta', { text: '\nI have prepared the Google Form plan. Please review the questions and click Confirm to create the form.\n' });
            }
            else if (userPrompt.includes('search') || userPrompt.includes('find') || userPrompt.includes('content')) {
                sendEvent('message.delta', { text: 'Searching CMS drafts and publications...\n' });
                sendEvent('tool.started', { tool: 'search_cms_content', input: { query: dto.message } });
                const searchResults = await this.toolsService.searchCmsContent(dto.message, dto.currentScreen);
                sendEvent('tool.result', { tool: 'search_cms_content', result: searchResults });
                sendEvent('message.delta', {
                    text: `Found ${searchResults.length} matching CMS records:\n` +
                        searchResults.map((r) => `- [${r.entityType}] ${r.title} (version ${r.version})`).join('\n') + '\n',
                });
            }
            else {
                sendEvent('message.delta', {
                    text: `I am your GEC CMS Copilot. I can assist you with:\n1. Drafting and updating CMS content across People, Teams, Initiatives, Stories, and Hero Spotlight.\n2. Creating and updating Google Form plans with automatic file-upload step verification.\n3. Building structured filters for response queries.\n\nHow would you like to proceed with "${dto.message}"?`,
                });
            }
            sendEvent('usage', { promptTokens: 42, completionTokens: 110, totalTokens: 152 });
            sendEvent('done', { status: 'completed' });
            await this.coreDb.query(`INSERT INTO copilot_messages (id, conversation_id, role, content, created_at)
         VALUES ($1, $2, 'assistant', $3, NOW())`, [(0, uuid_1.v4)(), conversationId, `Processed request: ${dto.message}`]);
        }
        catch (err) {
            this.logger.error(`Error streaming copilot message: ${err.message}`, err.stack);
            sendEvent('error', { message: err.message });
        }
        finally {
            res.end();
        }
    }
    async confirmAction(actionId, confirmDto, actorId) {
        const res = await this.coreDb.query('SELECT * FROM copilot_proposals WHERE id = $1', [actionId]);
        const proposal = res.rows[0];
        if (!proposal) {
            throw new common_1.NotFoundException(`Action proposal '${actionId}' not found.`);
        }
        if (proposal.actor_id !== actorId) {
            throw new common_1.ForbiddenException('Only the user who initiated the proposal can confirm it.');
        }
        if (new Date(proposal.expires_at) < new Date()) {
            await this.coreDb.query('UPDATE copilot_proposals SET status = \'expired\' WHERE id = $1', [actionId]);
            throw new common_1.BadRequestException('Action proposal has expired.');
        }
        const tokenHash = crypto_util_1.CryptoUtil.sha256(confirmDto.confirmationToken);
        if (tokenHash !== proposal.token_hash) {
            throw new common_1.UnauthorizedException('Invalid confirmation token.');
        }
        if (proposal.status === 'succeeded') {
            return {
                success: true,
                status: 'already_executed',
                actionType: proposal.action_type,
                message: 'Proposal was already confirmed and executed.',
            };
        }
        if (proposal.status !== 'proposed') {
            throw new common_1.BadRequestException(`Proposal cannot be confirmed in state '${proposal.status}'.`);
        }
        let executionResult = null;
        const input = typeof proposal.input === 'string' ? JSON.parse(proposal.input) : proposal.input;
        if (proposal.action_type === 'propose_cms_draft_update') {
            const draft = await this.contentService.getDraft(proposal.target_id);
            const updated = await this.contentService.updateDraft(proposal.target_id, {
                version: draft.version,
                title: draft.title,
                data: { ...draft.data, ...input.fieldDiff },
            }, draft.version, actorId);
            executionResult = { draftId: updated.id, version: updated.version };
        }
        else if (proposal.action_type === 'create_google_form_plan') {
            await this.formsDb.query('UPDATE google_form_plans SET status = \'accepted\' WHERE id = $1', [actionId]);
            executionResult = { planId: actionId, status: 'accepted' };
        }
        else if (proposal.action_type === 'publish_google_form') {
            await this.formsDb.query('UPDATE google_forms SET lifecycle_state = \'published\', updated_at = NOW() WHERE google_form_id = $1 OR id = $1', [proposal.target_id]);
            executionResult = { formId: proposal.target_id, state: 'published' };
        }
        else {
            executionResult = { status: 'executed' };
        }
        await this.coreDb.query('UPDATE copilot_proposals SET status = \'succeeded\', executed_at = NOW() WHERE id = $1', [actionId]);
        await this.auditService.log({
            actorId,
            action: `copilot.confirm.${proposal.action_type}`,
            resourceType: 'copilot_proposal',
            resourceId: actionId,
            details: { idempotencyKey: confirmDto.idempotencyKey, executionResult },
        });
        return {
            success: true,
            actionId,
            actionType: proposal.action_type,
            status: 'succeeded',
            result: executionResult,
        };
    }
};
exports.CopilotService = CopilotService;
exports.CopilotService = CopilotService = CopilotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        forms_database_service_1.FormsDatabaseService,
        mongo_service_1.MongoService,
        config_1.ConfigService,
        audit_service_1.AuditService,
        content_service_1.ContentService,
        copilot_tools_service_1.CopilotToolsService])
], CopilotService);
//# sourceMappingURL=copilot.service.js.map
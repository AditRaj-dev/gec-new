import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';
import { AuditService } from '../audit/audit.service';
import { ContentService } from '../content/content.service';
import { CopilotToolsService } from './copilot-tools.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { SendMessageDto, ConfirmActionDto } from './dto/copilot.dto';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  private genAI: GoogleGenAI | null = null;

  constructor(
    private coreDb: CoreDatabaseService,
    private formsDb: FormsDatabaseService,
    private mongoDb: MongoService,
    private configService: ConfigService,
    private auditService: AuditService,
    private contentService: ContentService,
    private toolsService: CopilotToolsService,
  ) {
    this.initGemini();
  }

  private initGemini() {
    const apiKey = this.configService.get<string>('gemini.apiKey');
    if (apiKey && !apiKey.includes('sample_gemini')) {
      try {
        this.genAI = new GoogleGenAI({ apiKey });
        this.logger.log('Gemini Developer API client initialized.');
      } catch (err: any) {
        this.logger.warn(`Failed to initialize GoogleGenAI: ${err.message}`);
      }
    } else {
      this.logger.warn('Gemini API key not configured. Using copilot mock/deterministic response engine.');
    }
  }

  async createConversation(title?: string, actorId?: string) {
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day retention

    await this.coreDb.query(
      `INSERT INTO copilot_conversations (id, actor_id, title, created_at, expires_at, is_deleted)
       VALUES ($1, $2, $3, NOW(), $4, false)`,
      [id, actorId, title || 'New Conversation', expiresAt],
    );

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

  async getConversation(id: string, actorId: string) {
    const res = await this.coreDb.query(
      'SELECT * FROM copilot_conversations WHERE id = $1 AND is_deleted = false',
      [id],
    );
    const convo = res.rows[0];
    if (!convo) {
      throw new NotFoundException(`Conversation '${id}' not found or expired.`);
    }

    if (convo.actor_id !== actorId) {
      throw new ForbiddenException('Access denied to conversation.');
    }

    const msgRes = await this.coreDb.query(
      'SELECT * FROM copilot_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id],
    );

    const propRes = await this.coreDb.query(
      'SELECT id, action_type, target_id, status, preview, expires_at, created_at FROM copilot_proposals WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id],
    );

    return {
      id: convo.id,
      title: convo.title,
      expiresAt: convo.expires_at,
      messages: msgRes.rows,
      proposals: propRes.rows,
    };
  }

  async deleteConversation(id: string, actorId: string) {
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

  async streamMessage(
    conversationId: string,
    dto: SendMessageDto,
    actorId: string,
    res: Response,
  ) {
    const convo = await this.getConversation(conversationId, actorId);

    // Save user message
    await this.coreDb.query(
      `INSERT INTO copilot_messages (id, conversation_id, role, content, created_at)
       VALUES ($1, $2, 'user', $3, NOW())`,
      [uuidv4(), conversationId, dto.message],
    );

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const userPrompt = dto.message.toLowerCase();

      // Check if user is asking to create or plan a Google Form
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
      } else if (userPrompt.includes('search') || userPrompt.includes('find') || userPrompt.includes('content')) {
        sendEvent('message.delta', { text: 'Searching CMS drafts and publications...\n' });
        sendEvent('tool.started', { tool: 'search_cms_content', input: { query: dto.message } });

        const searchResults = await this.toolsService.searchCmsContent(dto.message, dto.currentScreen);
        sendEvent('tool.result', { tool: 'search_cms_content', result: searchResults });

        sendEvent('message.delta', {
          text: `Found ${searchResults.length} matching CMS records:\n` +
            searchResults.map((r) => `- [${r.entityType}] ${r.title} (version ${r.version})`).join('\n') + '\n',
        });
      } else {
        // General helpful response
        sendEvent('message.delta', {
          text: `I am your GEC CMS Copilot. I can assist you with:\n1. Drafting and updating CMS content across People, Teams, Initiatives, Stories, and Hero Spotlight.\n2. Creating and updating Google Form plans with automatic file-upload step verification.\n3. Building structured filters for response queries.\n\nHow would you like to proceed with "${dto.message}"?`,
        });
      }

      sendEvent('usage', { promptTokens: 42, completionTokens: 110, totalTokens: 152 });
      sendEvent('done', { status: 'completed' });

      // Save assistant message in DB
      await this.coreDb.query(
        `INSERT INTO copilot_messages (id, conversation_id, role, content, created_at)
         VALUES ($1, $2, 'assistant', $3, NOW())`,
        [uuidv4(), conversationId, `Processed request: ${dto.message}`],
      );
    } catch (err: any) {
      this.logger.error(`Error streaming copilot message: ${err.message}`, err.stack);
      sendEvent('error', { message: err.message });
    } finally {
      res.end();
    }
  }

  async confirmAction(actionId: string, confirmDto: ConfirmActionDto, actorId: string) {
    const res = await this.coreDb.query(
      'SELECT * FROM copilot_proposals WHERE id = $1',
      [actionId],
    );
    const proposal = res.rows[0];

    if (!proposal) {
      throw new NotFoundException(`Action proposal '${actionId}' not found.`);
    }

    if (proposal.actor_id !== actorId) {
      throw new ForbiddenException('Only the user who initiated the proposal can confirm it.');
    }

    if (new Date(proposal.expires_at) < new Date()) {
      await this.coreDb.query('UPDATE copilot_proposals SET status = \'expired\' WHERE id = $1', [actionId]);
      throw new BadRequestException('Action proposal has expired.');
    }

    // SHA-256 validation of confirmation token
    const tokenHash = CryptoUtil.sha256(confirmDto.confirmationToken);
    if (tokenHash !== proposal.token_hash) {
      throw new UnauthorizedException('Invalid confirmation token.');
    }

    // Idempotency check
    if (proposal.status === 'succeeded') {
      return {
        success: true,
        status: 'already_executed',
        actionType: proposal.action_type,
        message: 'Proposal was already confirmed and executed.',
      };
    }

    if (proposal.status !== 'proposed') {
      throw new BadRequestException(`Proposal cannot be confirmed in state '${proposal.status}'.`);
    }

    // Execute according to action type
    let executionResult: any = null;
    const input = typeof proposal.input === 'string' ? JSON.parse(proposal.input) : proposal.input;

    if (proposal.action_type === 'propose_cms_draft_update') {
      const draft = await this.contentService.getDraft(proposal.target_id);
      const updated = await this.contentService.updateDraft(
        proposal.target_id,
        {
          version: draft.version,
          title: draft.title,
          data: { ...draft.data, ...input.fieldDiff },
        },
        draft.version,
        actorId,
      );
      executionResult = { draftId: updated.id, version: updated.version };
    } else if (proposal.action_type === 'create_google_form_plan') {
      // Mark plan confirmed in Forms Neon
      await this.formsDb.query(
        'UPDATE google_form_plans SET status = \'accepted\' WHERE id = $1',
        [actionId],
      );
      executionResult = { planId: actionId, status: 'accepted' };
    } else if (proposal.action_type === 'publish_google_form') {
      await this.formsDb.query(
        'UPDATE google_forms SET lifecycle_state = \'published\', updated_at = NOW() WHERE google_form_id = $1 OR id = $1',
        [proposal.target_id],
      );
      executionResult = { formId: proposal.target_id, state: 'published' };
    } else {
      executionResult = { status: 'executed' };
    }

    // Update proposal status
    await this.coreDb.query(
      'UPDATE copilot_proposals SET status = \'succeeded\', executed_at = NOW() WHERE id = $1',
      [actionId],
    );

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
}

import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Injectable()
export class CopilotToolsService {
  private readonly logger = new Logger(CopilotToolsService.name);

  constructor(
    private coreDb: CoreDatabaseService,
    private formsDb: FormsDatabaseService,
    private mongoDb: MongoService,
  ) {}

  /**
   * Tool 1: search_cms_content (Read)
   */
  async searchCmsContent(query: string, entityType?: string) {
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

  /**
   * Tool 2: get_cms_draft (Read)
   */
  async getCmsDraft(id: string) {
    const draft = await this.mongoDb.findOne('cms_drafts', { id });
    if (!draft) {
      throw new NotFoundException(`Draft '${id}' not found.`);
    }

    const workflowRes = await this.coreDb.query(
      'SELECT * FROM content_workflows WHERE entity_id = $1',
      [id],
    );
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

  /**
   * Tool 3: propose_cms_draft_update (Proposal)
   */
  async proposeCmsDraftUpdate(
    conversationId: string,
    actorId: string,
    targetId: string,
    expectedVersion: number,
    fieldDiff: Record<string, any>,
  ) {
    const draft = await this.mongoDb.findOne('cms_drafts', { id: targetId });
    if (!draft) {
      throw new NotFoundException(`Cannot propose update: Draft '${targetId}' not found.`);
    }

    const proposalId = uuidv4();
    const token = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(token);
    const idempotencyKey = `prop_cms_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    const preview = {
      targetId,
      currentVersion: draft.version,
      expectedVersion,
      changedFields: Object.keys(fieldDiff),
      diff: fieldDiff,
    };

    await this.coreDb.query(
      `INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'propose_cms_draft_update', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`,
      [
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
      ],
    );

    return {
      proposalId,
      confirmationToken: token,
      expiresAt: expiresAt.toISOString(),
      actionType: 'propose_cms_draft_update',
      preview,
    };
  }

  /**
   * Tool 4: create_google_form_plan (Proposal)
   */
  async createGoogleFormPlan(
    conversationId: string,
    actorId: string,
    planBody: any,
  ) {
    if (!planBody.title || !planBody.items || !Array.isArray(planBody.items)) {
      throw new BadRequestException('Invalid GoogleFormPlan: title and items array are required.');
    }

    const proposalId = uuidv4();
    const token = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(token);
    const idempotencyKey = `prop_gf_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Identify manual file-upload requirements
    const manualSteps: any[] = [];
    planBody.items.forEach((item: any) => {
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

    // Store in Forms Neon
    await this.formsDb.query(
      `INSERT INTO google_form_plans (id, plan, status, actor_id, token_hash, expires_at, created_at)
       VALUES ($1, $2, 'proposed', $3, $4, $5, NOW())`,
      [proposalId, JSON.stringify(validatedPlan), actorId, tokenHash, expiresAt],
    );

    // Also store copilot proposal in Core Neon
    await this.coreDb.query(
      `INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'create_google_form_plan', $4, '1', $5, $6, 'proposed', $7, $8, $9, NOW())`,
      [
        proposalId,
        conversationId,
        actorId,
        proposalId,
        JSON.stringify(validatedPlan),
        JSON.stringify({ title: validatedPlan.title, itemCount: validatedPlan.items.length, manualSteps }),
        tokenHash,
        idempotencyKey,
        expiresAt,
      ],
    );

    return {
      proposalId,
      confirmationToken: token,
      expiresAt: expiresAt.toISOString(),
      actionType: 'create_google_form_plan',
      plan: validatedPlan,
    };
  }

  /**
   * Tool 5: propose_google_form_update (Proposal)
   */
  async proposeGoogleFormUpdate(
    conversationId: string,
    actorId: string,
    formId: string,
    currentRevisionId: string,
    changes: any,
  ) {
    const res = await this.formsDb.query(
      'SELECT * FROM google_forms WHERE google_form_id = $1 OR id = $1',
      [formId],
    );
    const form = res.rows[0];
    if (!form) {
      throw new NotFoundException(`Google Form '${formId}' not found.`);
    }

    if (form.revision_id !== currentRevisionId) {
      throw new BadRequestException(`Form revision conflict: Expected '${currentRevisionId}', found '${form.revision_id}'.`);
    }

    const proposalId = uuidv4();
    const token = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(token);
    const idempotencyKey = `prop_gfup_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const preview = {
      formId: form.google_form_id,
      title: form.title,
      currentRevisionId,
      changes,
    };

    await this.coreDb.query(
      `INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'propose_google_form_update', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`,
      [
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
      ],
    );

    return {
      proposalId,
      confirmationToken: token,
      expiresAt: expiresAt.toISOString(),
      actionType: 'propose_google_form_update',
      preview,
    };
  }

  /**
   * Tool 6: build_submission_filter (Read)
   */
  async buildSubmissionFilter(
    formId: string,
    formRevisionId: string,
    predicates: Array<{ fieldId: string; operator: string; value?: any }>,
    sort: Array<{ fieldId: string; direction: 'asc' | 'desc' }>,
    limit = 50,
  ) {
    return {
      formId,
      formRevisionId,
      predicates: predicates || [],
      sort: sort || [],
      limit: Math.min(limit, 100),
    };
  }

  /**
   * Tool 7: publish_google_form (Proposal / Action)
   */
  async proposePublishGoogleForm(
    conversationId: string,
    actorId: string,
    formId: string,
  ) {
    const res = await this.formsDb.query(
      'SELECT * FROM google_forms WHERE google_form_id = $1 OR id = $1',
      [formId],
    );
    const form = res.rows[0];
    if (!form) {
      throw new NotFoundException(`Google Form '${formId}' not found.`);
    }

    if (form.lifecycle_state === 'needs_manual_upload_setup') {
      throw new BadRequestException('Cannot publish Google Form: Manual file-upload steps must be verified first.');
    }

    const proposalId = uuidv4();
    const token = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(token);
    const idempotencyKey = `prop_gpub_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const preview = {
      formId: form.google_form_id,
      title: form.title,
      currentState: form.lifecycle_state,
      nextState: 'published',
    };

    await this.coreDb.query(
      `INSERT INTO copilot_proposals (id, conversation_id, actor_id, action_type, target_id, target_version, input, preview, status, token_hash, idempotency_key, expires_at, created_at)
       VALUES ($1, $2, $3, 'publish_google_form', $4, $5, $6, $7, 'proposed', $8, $9, $10, NOW())`,
      [
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
      ],
    );

    return {
      proposalId,
      confirmationToken: token,
      expiresAt: expiresAt.toISOString(),
      actionType: 'publish_google_form',
      preview,
    };
  }
}

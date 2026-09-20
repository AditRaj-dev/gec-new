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
var ContentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
const mongo_service_1 = require("../../database/mongo.service");
const outbox_service_1 = require("../outbox/outbox.service");
const audit_service_1 = require("../audit/audit.service");
let ContentService = ContentService_1 = class ContentService {
    constructor(coreDb, mongoDb, outboxService, auditService) {
        this.coreDb = coreDb;
        this.mongoDb = mongoDb;
        this.outboxService = outboxService;
        this.auditService = auditService;
        this.logger = new common_1.Logger(ContentService_1.name);
    }
    async createDraft(dto, actorId) {
        const entityId = (0, uuid_1.v4)();
        const version = 1;
        const draftDoc = {
            id: entityId,
            entityType: dto.entityType,
            title: dto.title,
            slug: dto.slug || null,
            version,
            data: dto.data,
            createdBy: actorId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await this.mongoDb.insertOne('cms_drafts', draftDoc);
        await this.coreDb.query(`INSERT INTO content_workflows (id, entity_type, entity_id, current_version, workflow_state, last_edited_by, updated_at)
       VALUES ($1, $2, $3, $4, 'draft', $5, NOW())`, [(0, uuid_1.v4)(), dto.entityType, entityId, version, actorId]);
        await this.auditService.log({
            actorId,
            action: 'content.create_draft',
            resourceType: dto.entityType,
            resourceId: entityId,
            details: { title: dto.title, slug: dto.slug },
        });
        return draftDoc;
    }
    async getDraft(id) {
        const draft = await this.mongoDb.findOne('cms_drafts', { id });
        if (!draft) {
            throw new common_1.NotFoundException(`Content draft with ID '${id}' not found.`);
        }
        const workflowRes = await this.coreDb.query('SELECT * FROM content_workflows WHERE entity_id = $1', [id]);
        const workflow = workflowRes.rows[0] || {
            workflow_state: 'draft',
            current_version: draft.version,
        };
        return {
            ...draft,
            workflowState: workflow.workflow_state,
            scheduledPublishAt: workflow.scheduled_publish_at,
        };
    }
    async listDrafts(entityType) {
        const filter = entityType ? { entityType } : {};
        const drafts = await this.mongoDb.find('cms_drafts', filter);
        return drafts;
    }
    async updateDraft(id, dto, ifMatchVersion, actorId) {
        const draft = await this.mongoDb.findOne('cms_drafts', { id });
        if (!draft) {
            throw new common_1.NotFoundException(`Content draft with ID '${id}' not found.`);
        }
        const expectedVersion = ifMatchVersion !== undefined ? ifMatchVersion : dto.version;
        if (draft.version !== expectedVersion) {
            throw new common_1.ConflictException(`Optimistic concurrency conflict: Current version is ${draft.version}, provided version is ${expectedVersion}.`);
        }
        const nextVersion = draft.version + 1;
        const updatedDraft = await this.mongoDb.updateOne('cms_drafts', { id }, {
            title: dto.title !== undefined ? dto.title : draft.title,
            slug: dto.slug !== undefined ? dto.slug : draft.slug,
            version: nextVersion,
            data: dto.data,
            updatedAt: new Date().toISOString(),
        });
        await this.coreDb.query(`UPDATE content_workflows 
       SET current_version = $1, last_edited_by = $2, updated_at = NOW() 
       WHERE entity_id = $3`, [nextVersion, actorId || null, id]);
        await this.auditService.log({
            actorId,
            action: 'content.update_draft',
            resourceType: draft.entityType,
            resourceId: id,
            details: { newVersion: nextVersion },
        });
        return updatedDraft;
    }
    async transitionWorkflow(id, dto, actorId) {
        const res = await this.coreDb.query('SELECT * FROM content_workflows WHERE entity_id = $1', [id]);
        if (res.rowCount === 0) {
            throw new common_1.NotFoundException(`Workflow for content '${id}' not found.`);
        }
        await this.coreDb.query(`UPDATE content_workflows 
       SET workflow_state = $1, scheduled_publish_at = $2, last_edited_by = $3, updated_at = NOW() 
       WHERE entity_id = $4`, [dto.workflowState, dto.scheduledPublishAt || null, actorId, id]);
        await this.auditService.log({
            actorId,
            action: 'content.transition_workflow',
            resourceType: res.rows[0].entity_type,
            resourceId: id,
            details: { toState: dto.workflowState },
        });
        return { success: true, workflowState: dto.workflowState };
    }
    async publish(id, idempotencyKey, actorId) {
        const draft = await this.mongoDb.findOne('cms_drafts', { id });
        if (!draft) {
            throw new common_1.NotFoundException(`Cannot publish: Draft '${id}' not found.`);
        }
        const snapshotId = (0, uuid_1.v4)();
        const snapshotDoc = {
            id: snapshotId,
            entityId: id,
            entityType: draft.entityType,
            slug: draft.slug,
            version: draft.version,
            title: draft.title,
            data: draft.data,
            publishedAt: new Date().toISOString(),
            publishedBy: actorId,
        };
        await this.mongoDb.insertOne('cms_published_snapshots', snapshotDoc);
        const client = await this.coreDb.getClient();
        const publicationId = (0, uuid_1.v4)();
        try {
            if (client.query) {
                await client.query('BEGIN');
            }
            await client.query(`UPDATE publications 
         SET is_active = false, unbound_at = NOW() 
         WHERE entity_type = $1 AND entity_id = $2 AND is_active = true`, [draft.entityType, id]);
            await client.query(`INSERT INTO publications (id, entity_type, entity_id, slug, version, mongo_snapshot_id, workflow_state, published_by, published_at, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, NOW(), true)`, [publicationId, draft.entityType, id, draft.slug, draft.version, snapshotId, actorId]);
            await client.query(`UPDATE content_workflows 
         SET workflow_state = 'published', last_edited_by = $1, updated_at = NOW() 
         WHERE entity_id = $2`, [actorId, id]);
            const tags = [
                draft.entityType,
                `content:${id}`,
                draft.slug ? `${draft.entityType}:${draft.slug}` : null,
            ].filter(Boolean);
            const paths = [`/${draft.entityType}`, draft.slug ? `/${draft.entityType}/${draft.slug}` : `/${draft.entityType}/${id}`];
            await this.outboxService.createEvent('cache_invalidation', {
                publicationId,
                entityType: draft.entityType,
                entityId: id,
                tags,
                paths,
            });
            await this.auditService.log({
                actorId,
                action: 'content.publish',
                resourceType: draft.entityType,
                resourceId: id,
                details: { version: draft.version, publicationId, snapshotId, idempotencyKey },
            });
            if (client.query) {
                await client.query('COMMIT');
            }
        }
        catch (err) {
            if (client.query) {
                await client.query('ROLLBACK');
            }
            throw err;
        }
        finally {
            if (client.release)
                client.release();
        }
        return {
            success: true,
            publicationId,
            entityId: id,
            version: draft.version,
            snapshotId,
        };
    }
    async getPublicContent(entityType, slugOrId) {
        const res = await this.coreDb.query(`SELECT * FROM publications 
       WHERE entity_type = $1 
         AND is_active = true 
         AND (slug = $2 OR entity_id::text = $2)
       LIMIT 1`, [entityType, slugOrId]);
        const pub = res.rows[0];
        if (!pub) {
            throw new common_1.NotFoundException(`Published content for '${entityType}' '${slugOrId}' not found.`);
        }
        const snapshot = await this.mongoDb.findOne('cms_published_snapshots', {
            id: pub.mongo_snapshot_id,
        });
        if (!snapshot) {
            throw new common_1.NotFoundException(`Published snapshot data missing for '${slugOrId}'.`);
        }
        return {
            id: snapshot.entityId,
            entityType: snapshot.entityType,
            slug: snapshot.slug,
            version: snapshot.version,
            title: snapshot.title,
            data: snapshot.data,
            publishedAt: snapshot.publishedAt,
        };
    }
    async listPublicContent(entityType) {
        const res = await this.coreDb.query(`SELECT * FROM publications 
       WHERE entity_type = $1 AND is_active = true 
       ORDER BY published_at DESC`, [entityType]);
        const items = [];
        for (const pub of res.rows) {
            const snapshot = await this.mongoDb.findOne('cms_published_snapshots', {
                id: pub.mongo_snapshot_id,
            });
            if (snapshot) {
                items.push({
                    id: snapshot.entityId,
                    entityType: snapshot.entityType,
                    slug: snapshot.slug,
                    version: snapshot.version,
                    title: snapshot.title,
                    data: snapshot.data,
                    publishedAt: snapshot.publishedAt,
                });
            }
        }
        return items;
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = ContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        mongo_service_1.MongoService,
        outbox_service_1.OutboxService,
        audit_service_1.AuditService])
], ContentService);
//# sourceMappingURL=content.service.js.map
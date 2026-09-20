import { CoreDatabaseService } from '../../database/core-database.service';
import { MongoService } from '../../database/mongo.service';
import { OutboxService } from '../outbox/outbox.service';
import { AuditService } from '../audit/audit.service';
import { CreateContentDraftDto, UpdateContentDraftDto, TransitionWorkflowDto, WorkflowState } from './dto/content.dto';
export declare class ContentService {
    private coreDb;
    private mongoDb;
    private outboxService;
    private auditService;
    private readonly logger;
    constructor(coreDb: CoreDatabaseService, mongoDb: MongoService, outboxService: OutboxService, auditService: AuditService);
    createDraft(dto: CreateContentDraftDto, actorId: string): Promise<{
        id: string;
        entityType: string;
        title: string;
        slug: string;
        version: number;
        data: Record<string, any>;
        createdBy: string;
        createdAt: string;
        updatedAt: string;
    }>;
    getDraft(id: string): Promise<any>;
    listDrafts(entityType?: string): Promise<any[]>;
    updateDraft(id: string, dto: UpdateContentDraftDto, ifMatchVersion?: number, actorId?: string): Promise<any>;
    transitionWorkflow(id: string, dto: TransitionWorkflowDto, actorId: string): Promise<{
        success: boolean;
        workflowState: WorkflowState;
    }>;
    publish(id: string, idempotencyKey: string | undefined, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
    getPublicContent(entityType: string, slugOrId: string): Promise<{
        id: any;
        entityType: any;
        slug: any;
        version: any;
        title: any;
        data: any;
        publishedAt: any;
    }>;
    listPublicContent(entityType: string): Promise<any[]>;
}

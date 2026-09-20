import { ContentService } from './content.service';
import { CreateContentDraftDto, UpdateContentDraftDto, TransitionWorkflowDto } from './dto/content.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    createDraft(dto: CreateContentDraftDto, user: AuthenticatedUser): Promise<{
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
    listDrafts(entityType?: string): Promise<any[]>;
    getDraft(id: string): Promise<any>;
    updateDraft(id: string, dto: UpdateContentDraftDto, ifMatch?: string, user?: AuthenticatedUser): Promise<any>;
    transitionWorkflow(id: string, dto: TransitionWorkflowDto, user: AuthenticatedUser): Promise<{
        success: boolean;
        workflowState: import("./dto/content.dto").WorkflowState;
    }>;
    publish(id: string, idempotencyKey: string | undefined, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

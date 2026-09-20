export declare enum WorkflowState {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    PUBLISHED = "published",
    SCHEDULED = "scheduled",
    ARCHIVED = "archived"
}
export declare class CreateContentDraftDto {
    entityType: string;
    slug?: string;
    title: string;
    data: Record<string, any>;
}
export declare class UpdateContentDraftDto {
    version: number;
    title?: string;
    slug?: string;
    data: Record<string, any>;
}
export declare class TransitionWorkflowDto {
    workflowState: WorkflowState;
    scheduledPublishAt?: string;
}

export declare enum GoogleFormLifecycleState {
    PROPOSED = "proposed",
    UNPUBLISHED = "unpublished",
    NEEDS_MANUAL_UPLOAD_SETUP = "needs_manual_upload_setup",
    READY_FOR_REVIEW = "ready_for_review",
    PUBLISHED = "published",
    CLOSED = "closed",
    FAILED = "failed",
    EXTERNAL_MISSING = "external_missing"
}
export declare class CreateFormFromPlanDto {
    planId: string;
    idempotencyKey: string;
}
export declare class UpdateGoogleFormDto {
    currentRevisionId: string;
    title?: string;
    items?: any[];
    idempotencyKey: string;
}
export declare class VerifyManualStepsDto {
    observedItemIds?: string[];
}
export declare class SheetExportDto {
    spreadsheetId: string;
    tabName: string;
    idempotencyKey: string;
}

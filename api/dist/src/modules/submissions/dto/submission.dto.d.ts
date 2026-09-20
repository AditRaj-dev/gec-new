export declare enum SubmissionType {
    INITIATIVE_APPLICATION = "initiative_application",
    RECRUITMENT = "recruitment",
    PITCH = "pitch",
    CONTACT = "contact"
}
export declare enum SubmissionStatus {
    SUBMITTED = "submitted",
    IN_REVIEW = "in_review",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected",
    ACCEPTED = "accepted"
}
export declare class CreatePublicSubmissionDto {
    submissionType: SubmissionType;
    targetEntityId?: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    payload: Record<string, any>;
    attachmentKeys?: string[];
}
export declare class UpdateSubmissionStatusDto {
    status: SubmissionStatus;
    note?: string;
}

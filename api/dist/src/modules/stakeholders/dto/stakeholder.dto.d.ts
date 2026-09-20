export declare enum StakeholderType {
    PARTNER = "partner",
    SPEAKER = "speaker",
    STARTUP = "startup",
    ALUMNI = "alumni"
}
export declare class CreateStakeholderDto {
    name: string;
    type: StakeholderType;
    designation?: string;
    logoOrAvatarUrl?: string;
    websiteUrl?: string;
    description?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateStakeholderDto {
    name?: string;
    type?: StakeholderType;
    designation?: string;
    logoOrAvatarUrl?: string;
    websiteUrl?: string;
    description?: string;
    metadata?: Record<string, any>;
}

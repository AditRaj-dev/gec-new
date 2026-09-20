export declare enum PersonCategory {
    LEADERSHIP = "leadership",
    MENTORS = "mentors",
    TEAM_HEADS = "team_heads",
    COORDINATORS = "coordinators",
    MEMBERS = "members",
    ALUMNI = "alumni"
}
export declare class CreatePersonDto {
    name: string;
    category: PersonCategory;
    roleTitle: string;
    teamScope?: string;
    avatarUrl?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
}
export declare class UpdatePersonDto {
    name?: string;
    category?: PersonCategory;
    roleTitle?: string;
    teamScope?: string;
    avatarUrl?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
}

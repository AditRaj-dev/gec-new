export declare class CreateTeamDto {
    slug: string;
    name: string;
    description: string;
    head?: Record<string, any>;
    coordinators?: Record<string, any>[];
    members?: Record<string, any>[];
    responsibilities?: string[];
    recruitmentSettings?: Record<string, any>;
}
export declare class UpdateTeamDto {
    name?: string;
    description?: string;
    head?: Record<string, any>;
    coordinators?: Record<string, any>[];
    members?: Record<string, any>[];
    responsibilities?: string[];
    recruitmentSettings?: Record<string, any>;
}

export declare class CreateInitiativeDto {
    slug: string;
    title: string;
    tagline: string;
    overview?: string;
    timeline?: Record<string, any>[];
    eligibility?: string[];
    faqs?: Record<string, string>[];
    contentBlocks?: Record<string, any>[];
    cta?: Record<string, any>;
}
export declare class UpdateInitiativeDto {
    title?: string;
    tagline?: string;
    overview?: string;
    timeline?: Record<string, any>[];
    eligibility?: string[];
    faqs?: Record<string, string>[];
    contentBlocks?: Record<string, any>[];
    cta?: Record<string, any>;
}

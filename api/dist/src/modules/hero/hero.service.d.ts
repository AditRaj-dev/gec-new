import { ContentService } from '../content/content.service';
import { CreateHeroSpotlightDto, UpdateHeroSpotlightDto, HeroLifecycleState } from './dto/hero-spotlight.dto';
export declare class HeroService {
    private contentService;
    constructor(contentService: ContentService);
    create(dto: CreateHeroSpotlightDto, actorId: string): Promise<{
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
    list(): Promise<any[]>;
    get(id: string): Promise<any>;
    update(id: string, dto: UpdateHeroSpotlightDto, actorId: string): Promise<any>;
    publish(id: string, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
    getActiveHero(): Promise<{
        isEvergreen: boolean;
        id: any;
        title: any;
        priority: any;
        lifecycleState: any;
        headline: any;
        shortContext: any;
        statusTag: any;
        visualAssets: any;
        primaryCta: any;
        secondaryCta: any;
        publishedAt: any;
    } | {
        isEvergreen: boolean;
        priority: string;
        lifecycleState: HeroLifecycleState;
        headline: string;
        shortContext: string;
        statusTag: string;
        primaryCta: {
            label: string;
            url: string;
        };
        secondaryCta: {
            label: string;
            url: string;
        };
        visualAssets: {
            staticDesktopUrl: string;
            staticMobileUrl: string;
        };
        id?: undefined;
        title?: undefined;
        publishedAt?: undefined;
    }>;
    private validatePriorityGating;
}

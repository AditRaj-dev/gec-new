import { HeroService } from './hero.service';
import { CreateHeroSpotlightDto, UpdateHeroSpotlightDto } from './dto/hero-spotlight.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsHeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    create(dto: CreateHeroSpotlightDto, user: AuthenticatedUser): Promise<{
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
    update(id: string, dto: UpdateHeroSpotlightDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

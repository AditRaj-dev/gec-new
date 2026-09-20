import { ContentService } from '../content/content.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';
export declare class InitiativesService {
    private contentService;
    constructor(contentService: ContentService);
    create(dto: CreateInitiativeDto, actorId: string): Promise<{
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
    update(id: string, dto: UpdateInitiativeDto, actorId: string): Promise<any>;
    publish(id: string, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
    listPublic(): Promise<any[]>;
    getPublic(slugOrId: string): Promise<{
        id: any;
        entityType: any;
        slug: any;
        version: any;
        title: any;
        data: any;
        publishedAt: any;
    }>;
}

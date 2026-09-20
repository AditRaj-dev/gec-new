import { ContentService } from '../content/content.service';
import { CreateStakeholderDto, UpdateStakeholderDto, StakeholderType } from './dto/stakeholder.dto';
export declare class StakeholdersService {
    private contentService;
    constructor(contentService: ContentService);
    create(dto: CreateStakeholderDto, actorId: string): Promise<{
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
    list(type?: StakeholderType): Promise<any[]>;
    get(id: string): Promise<any>;
    update(id: string, dto: UpdateStakeholderDto, actorId: string): Promise<any>;
    publish(id: string, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
    listPublic(type?: StakeholderType): Promise<any[]>;
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

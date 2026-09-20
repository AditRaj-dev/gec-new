import { ContentService } from '../content/content.service';
import { CreateStoryDto, UpdateStoryDto, StoryCategory } from './dto/story.dto';
export declare class StoriesService {
    private contentService;
    constructor(contentService: ContentService);
    create(dto: CreateStoryDto, actorId: string): Promise<{
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
    list(category?: StoryCategory): Promise<any[]>;
    get(id: string): Promise<any>;
    update(id: string, dto: UpdateStoryDto, actorId: string): Promise<any>;
    publish(id: string, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
    listPublic(category?: StoryCategory): Promise<any[]>;
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

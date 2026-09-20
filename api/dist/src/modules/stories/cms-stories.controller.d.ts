import { StoriesService } from './stories.service';
import { CreateStoryDto, UpdateStoryDto, StoryCategory } from './dto/story.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsStoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(dto: CreateStoryDto, user: AuthenticatedUser): Promise<{
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
    update(id: string, dto: UpdateStoryDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

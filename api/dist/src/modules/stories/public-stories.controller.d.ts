import { StoriesService } from './stories.service';
import { StoryCategory } from './dto/story.dto';
export declare class PublicStoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
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

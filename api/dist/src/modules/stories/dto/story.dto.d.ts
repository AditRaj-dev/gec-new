export declare enum StoryCategory {
    NEWS = "news",
    FOUNDER_STORIES = "founder_stories",
    STARTUP_STORIES = "startup_stories",
    EVENT_STORIES = "event_stories",
    FEATURED_STORIES = "featured_stories"
}
export declare class CreateStoryDto {
    slug: string;
    title: string;
    category: StoryCategory;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    authorName?: string;
    isFeatured?: boolean;
    tags?: string[];
}
export declare class UpdateStoryDto {
    title?: string;
    category?: StoryCategory;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string;
    authorName?: string;
    isFeatured?: boolean;
    tags?: string[];
}

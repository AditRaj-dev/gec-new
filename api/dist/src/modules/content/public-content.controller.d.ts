import { ContentService } from './content.service';
export declare class PublicContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    listPublicContent(entityType: string): Promise<any[]>;
    getPublicContent(entityType: string, slugOrId: string): Promise<{
        id: any;
        entityType: any;
        slug: any;
        version: any;
        title: any;
        data: any;
        publishedAt: any;
    }>;
}

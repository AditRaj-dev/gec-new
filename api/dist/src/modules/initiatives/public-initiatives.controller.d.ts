import { InitiativesService } from './initiatives.service';
export declare class PublicInitiativesController {
    private readonly initiativesService;
    constructor(initiativesService: InitiativesService);
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

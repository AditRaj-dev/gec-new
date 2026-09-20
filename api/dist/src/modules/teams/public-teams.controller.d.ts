import { TeamsService } from './teams.service';
export declare class PublicTeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
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

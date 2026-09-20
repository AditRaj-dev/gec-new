import { StakeholdersService } from './stakeholders.service';
import { StakeholderType } from './dto/stakeholder.dto';
export declare class PublicStakeholdersController {
    private readonly stakeholdersService;
    constructor(stakeholdersService: StakeholdersService);
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

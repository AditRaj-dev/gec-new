import { StakeholdersService } from './stakeholders.service';
import { CreateStakeholderDto, UpdateStakeholderDto, StakeholderType } from './dto/stakeholder.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsStakeholdersController {
    private readonly stakeholdersService;
    constructor(stakeholdersService: StakeholdersService);
    create(dto: CreateStakeholderDto, user: AuthenticatedUser): Promise<{
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
    update(id: string, dto: UpdateStakeholderDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

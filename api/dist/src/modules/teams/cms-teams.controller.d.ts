import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsTeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(dto: CreateTeamDto, user: AuthenticatedUser): Promise<{
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
    list(): Promise<any[]>;
    get(id: string): Promise<any>;
    update(id: string, dto: UpdateTeamDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

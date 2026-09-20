import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsInitiativesController {
    private readonly initiativesService;
    constructor(initiativesService: InitiativesService);
    create(dto: CreateInitiativeDto, user: AuthenticatedUser): Promise<{
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
    update(id: string, dto: UpdateInitiativeDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

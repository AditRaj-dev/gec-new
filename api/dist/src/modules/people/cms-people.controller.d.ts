import { PeopleService } from './people.service';
import { CreatePersonDto, UpdatePersonDto, PersonCategory } from './dto/person.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsPeopleController {
    private readonly peopleService;
    constructor(peopleService: PeopleService);
    create(dto: CreatePersonDto, user: AuthenticatedUser): Promise<{
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
    list(category?: PersonCategory): Promise<any[]>;
    get(id: string): Promise<any>;
    update(id: string, dto: UpdatePersonDto, user: AuthenticatedUser): Promise<any>;
    publish(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
}

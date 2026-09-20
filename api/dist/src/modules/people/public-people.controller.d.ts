import { PeopleService } from './people.service';
import { PersonCategory } from './dto/person.dto';
export declare class PublicPeopleController {
    private readonly peopleService;
    constructor(peopleService: PeopleService);
    listPublic(category?: PersonCategory): Promise<any[]>;
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

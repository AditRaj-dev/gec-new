import { MongoService } from '../../database/mongo.service';
import { ContentService } from '../content/content.service';
import { AuditService } from '../audit/audit.service';
import { CreatePersonDto, UpdatePersonDto, PersonCategory } from './dto/person.dto';
export declare class PeopleService {
    private mongoDb;
    private contentService;
    private auditService;
    constructor(mongoDb: MongoService, contentService: ContentService, auditService: AuditService);
    create(dto: CreatePersonDto, actorId: string): Promise<{
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
    update(id: string, dto: UpdatePersonDto, actorId: string): Promise<any>;
    publish(id: string, actorId: string): Promise<{
        success: boolean;
        publicationId: string;
        entityId: string;
        version: any;
        snapshotId: string;
    }>;
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

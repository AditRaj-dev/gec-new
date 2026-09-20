import { CoreDatabaseService } from '../../database/core-database.service';
export interface AuditRecordInput {
    actorId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    requestId?: string;
    ipAddress?: string;
    details?: Record<string, any>;
    contentHash?: string;
}
export declare class AuditService {
    private coreDb;
    private readonly logger;
    constructor(coreDb: CoreDatabaseService);
    log(input: AuditRecordInput): Promise<string>;
    queryLogs(filter: {
        actorId?: string;
        resourceType?: string;
        limit?: number;
    }): Promise<any[]>;
}

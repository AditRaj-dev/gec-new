import { CoreDatabaseService } from '../../database/core-database.service';
import { AuditService } from '../audit/audit.service';
import { CreatePublicSubmissionDto, UpdateSubmissionStatusDto, SubmissionType, SubmissionStatus } from './dto/submission.dto';
export declare class SubmissionsService {
    private coreDb;
    private auditService;
    constructor(coreDb: CoreDatabaseService, auditService: AuditService);
    createPublic(dto: CreatePublicSubmissionDto): Promise<{
        success: boolean;
        submissionId: string;
        message: string;
    }>;
    list(filter: {
        submissionType?: SubmissionType;
        status?: SubmissionStatus;
        limit?: number;
    }): Promise<any[]>;
    get(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateSubmissionStatusDto, actorId: string): Promise<{
        success: boolean;
        status: SubmissionStatus;
    }>;
    exportCsv(submissionType?: SubmissionType): Promise<string>;
}

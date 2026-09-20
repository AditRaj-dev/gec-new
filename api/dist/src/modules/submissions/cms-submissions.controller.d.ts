import { Response } from 'express';
import { SubmissionsService } from './submissions.service';
import { UpdateSubmissionStatusDto, SubmissionType, SubmissionStatus } from './dto/submission.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CmsSubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    list(type?: SubmissionType, status?: SubmissionStatus, limit?: number): Promise<any[]>;
    exportCsv(type: SubmissionType | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    get(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateSubmissionStatusDto, user: AuthenticatedUser): Promise<{
        success: boolean;
        status: SubmissionStatus;
    }>;
}

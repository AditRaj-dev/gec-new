import { SubmissionsService } from './submissions.service';
import { CreatePublicSubmissionDto } from './dto/submission.dto';
export declare class PublicSubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    create(dto: CreatePublicSubmissionDto): Promise<{
        success: boolean;
        submissionId: string;
        message: string;
    }>;
}

import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
import { AuditService } from '../audit/audit.service';
import { PresignUploadDto, CompleteUploadDto, BucketClass } from './dto/media.dto';
export declare class MediaService {
    private configService;
    private coreDb;
    private auditService;
    private readonly logger;
    private s3Client;
    constructor(configService: ConfigService, coreDb: CoreDatabaseService, auditService: AuditService);
    private initS3Client;
    presignUpload(dto: PresignUploadDto, actorId?: string): Promise<{
        assetId: string;
        r2Key: string;
        bucketClass: BucketClass;
        uploadUrl: string;
        expiresInSeconds: number;
        headers: {
            'Content-Type': string;
        };
    }>;
    completeUpload(dto: CompleteUploadDto, actorId?: string): Promise<{
        id: string;
        r2Key: string;
        bucketClass: BucketClass;
        publicUrl: string;
        status: string;
    }>;
    getDownloadUrl(r2Key: string, actorId: string): Promise<{
        downloadUrl: any;
        isPublic: boolean;
        expiresInSeconds?: undefined;
    } | {
        downloadUrl: string;
        isPublic: boolean;
        expiresInSeconds: number;
    }>;
    listMedia(bucketClass?: BucketClass, purpose?: string): Promise<any[]>;
}

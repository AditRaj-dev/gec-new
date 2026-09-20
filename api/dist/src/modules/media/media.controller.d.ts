import { MediaService } from './media.service';
import { PresignUploadDto, CompleteUploadDto, BucketClass } from './dto/media.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    presign(dto: PresignUploadDto, user: AuthenticatedUser): Promise<{
        assetId: string;
        r2Key: string;
        bucketClass: BucketClass;
        uploadUrl: string;
        expiresInSeconds: number;
        headers: {
            'Content-Type': string;
        };
    }>;
    complete(dto: CompleteUploadDto, user: AuthenticatedUser): Promise<{
        id: string;
        r2Key: string;
        bucketClass: BucketClass;
        publicUrl: string;
        status: string;
    }>;
    getDownloadUrl(key: string, user: AuthenticatedUser): Promise<{
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

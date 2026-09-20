export declare enum BucketClass {
    PUBLIC = "public",
    PRIVATE = "private"
}
export declare class PresignUploadDto {
    filename: string;
    mimeType: string;
    byteSize: number;
    bucketClass: BucketClass;
    purpose?: string;
    entityType?: string;
    entityId?: string;
}
export declare class CompleteUploadDto {
    r2Key: string;
    bucketClass: BucketClass;
    originalFilename: string;
    mimeType: string;
    byteSize: number;
    purpose?: string;
}

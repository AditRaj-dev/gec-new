"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
const audit_service_1 = require("../audit/audit.service");
const media_dto_1 = require("./dto/media.dto");
let MediaService = MediaService_1 = class MediaService {
    constructor(configService, coreDb, auditService) {
        this.configService = configService;
        this.coreDb = coreDb;
        this.auditService = auditService;
        this.logger = new common_1.Logger(MediaService_1.name);
        this.s3Client = null;
        this.initS3Client();
    }
    initS3Client() {
        const endpoint = this.configService.get('r2.endpoint');
        const accessKeyId = this.configService.get('r2.accessKeyId');
        const secretAccessKey = this.configService.get('r2.secretAccessKey');
        if (endpoint && accessKeyId && secretAccessKey && !endpoint.includes('sample_account_id')) {
            this.s3Client = new client_s3_1.S3Client({
                region: 'auto',
                endpoint,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            this.logger.log('Cloudflare R2 S3 client initialized.');
        }
        else {
            this.logger.warn('Cloudflare R2 credentials not configured. Using local media mock mode.');
        }
    }
    async presignUpload(dto, actorId) {
        const assetUuid = (0, uuid_1.v4)();
        const safeName = dto.filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        let r2Key;
        if (dto.bucketClass === media_dto_1.BucketClass.PUBLIC) {
            const entityType = dto.entityType || 'general';
            const entityUuid = dto.entityId || (0, uuid_1.v4)();
            r2Key = `public/${entityType}/${entityUuid}/${assetUuid}/v1-${safeName}`;
        }
        else {
            const submissionUuid = dto.entityId || (0, uuid_1.v4)();
            r2Key = `private/submissions/${submissionUuid}/${assetUuid}/${safeName}`;
        }
        const bucket = dto.bucketClass === media_dto_1.BucketClass.PUBLIC
            ? this.configService.get('r2.publicBucket') || 'gec-public-media-dev'
            : this.configService.get('r2.privateBucket') || 'gec-private-submissions-dev';
        const ttlSeconds = this.configService.get('r2.uploadUrlTtlSeconds') || 900;
        let uploadUrl;
        if (this.s3Client) {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: r2Key,
                ContentType: dto.mimeType,
                ContentLength: dto.byteSize,
            });
            uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: ttlSeconds });
        }
        else {
            uploadUrl = `http://localhost:4000/media-mock/upload/${r2Key}?expires=${Date.now() + ttlSeconds * 1000}`;
        }
        return {
            assetId: assetUuid,
            r2Key,
            bucketClass: dto.bucketClass,
            uploadUrl,
            expiresInSeconds: ttlSeconds,
            headers: {
                'Content-Type': dto.mimeType,
            },
        };
    }
    async completeUpload(dto, actorId) {
        const bucket = dto.bucketClass === media_dto_1.BucketClass.PUBLIC
            ? this.configService.get('r2.publicBucket') || 'gec-public-media-dev'
            : this.configService.get('r2.privateBucket') || 'gec-private-submissions-dev';
        if (this.s3Client) {
            try {
                const headCommand = new client_s3_1.HeadObjectCommand({
                    Bucket: bucket,
                    Key: dto.r2Key,
                });
                await this.s3Client.send(headCommand);
            }
            catch (err) {
                throw new common_1.BadRequestException(`Failed to verify object in R2: ${err.message}`);
            }
        }
        const assetId = (0, uuid_1.v4)();
        const publicBase = this.configService.get('r2.publicBaseUrl') || 'https://media.gec.org';
        const publicUrl = dto.bucketClass === media_dto_1.BucketClass.PUBLIC ? `${publicBase}/${dto.r2Key}` : null;
        await this.coreDb.query(`INSERT INTO media_assets (id, bucket_class, r2_key, mime_type, byte_size, original_filename, public_url, purpose, uploader_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'finalized', NOW(), NOW())`, [
            assetId,
            dto.bucketClass,
            dto.r2Key,
            dto.mimeType,
            dto.byteSize,
            dto.originalFilename,
            publicUrl,
            dto.purpose || null,
            actorId || null,
        ]);
        await this.auditService.log({
            actorId,
            action: 'media.complete_upload',
            resourceType: 'media_asset',
            resourceId: assetId,
            details: { r2Key: dto.r2Key, bucketClass: dto.bucketClass },
        });
        return {
            id: assetId,
            r2Key: dto.r2Key,
            bucketClass: dto.bucketClass,
            publicUrl,
            status: 'finalized',
        };
    }
    async getDownloadUrl(r2Key, actorId) {
        const res = await this.coreDb.query('SELECT * FROM media_assets WHERE r2_key = $1', [r2Key]);
        const asset = res.rows[0];
        if (!asset) {
            throw new common_1.NotFoundException(`Media asset '${r2Key}' not found.`);
        }
        if (asset.bucket_class === media_dto_1.BucketClass.PUBLIC && asset.public_url) {
            return { downloadUrl: asset.public_url, isPublic: true };
        }
        const bucket = this.configService.get('r2.privateBucket') || 'gec-private-submissions-dev';
        let downloadUrl;
        if (this.s3Client) {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: bucket,
                Key: r2Key,
            });
            downloadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 300 });
        }
        else {
            downloadUrl = `http://localhost:4000/media-mock/download/${r2Key}?token=mock_signed_download_token`;
        }
        return {
            downloadUrl,
            isPublic: false,
            expiresInSeconds: 300,
        };
    }
    async listMedia(bucketClass, purpose) {
        const res = await this.coreDb.query(`SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 100`);
        let items = res.rows;
        if (bucketClass)
            items = items.filter((m) => m.bucket_class === bucketClass);
        if (purpose)
            items = items.filter((m) => m.purpose === purpose);
        return items;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_database_service_1.CoreDatabaseService,
        audit_service_1.AuditService])
], MediaService);
//# sourceMappingURL=media.service.js.map
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { CoreDatabaseService } from '../../database/core-database.service';
import { AuditService } from '../audit/audit.service';
import { PresignUploadDto, CompleteUploadDto, BucketClass } from './dto/media.dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private s3Client: S3Client | null = null;

  constructor(
    private configService: ConfigService,
    private coreDb: CoreDatabaseService,
    private auditService: AuditService,
  ) {
    this.initS3Client();
  }

  private initS3Client() {
    const endpoint = this.configService.get<string>('r2.endpoint');
    const accessKeyId = this.configService.get<string>('r2.accessKeyId');
    const secretAccessKey = this.configService.get<string>('r2.secretAccessKey');

    if (endpoint && accessKeyId && secretAccessKey && !endpoint.includes('sample_account_id')) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log('Cloudflare R2 S3 client initialized.');
    } else {
      this.logger.warn('Cloudflare R2 credentials not configured. Using local media mock mode.');
    }
  }

  async presignUpload(dto: PresignUploadDto, actorId?: string) {
    const assetUuid = uuidv4();
    const safeName = dto.filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();

    // Construct key pattern matching architecture.md section 8
    let r2Key: string;
    if (dto.bucketClass === BucketClass.PUBLIC) {
      const entityType = dto.entityType || 'general';
      const entityUuid = dto.entityId || uuidv4();
      r2Key = `public/${entityType}/${entityUuid}/${assetUuid}/v1-${safeName}`;
    } else {
      const submissionUuid = dto.entityId || uuidv4();
      r2Key = `private/submissions/${submissionUuid}/${assetUuid}/${safeName}`;
    }

    const bucket =
      dto.bucketClass === BucketClass.PUBLIC
        ? this.configService.get<string>('r2.publicBucket') || 'gec-public-media-dev'
        : this.configService.get<string>('r2.privateBucket') || 'gec-private-submissions-dev';

    const ttlSeconds = this.configService.get<number>('r2.uploadUrlTtlSeconds') || 900;
    let uploadUrl: string;

    if (this.s3Client) {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: r2Key,
        ContentType: dto.mimeType,
        ContentLength: dto.byteSize,
      });
      uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: ttlSeconds });
    } else {
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

  async completeUpload(dto: CompleteUploadDto, actorId?: string) {
    const bucket =
      dto.bucketClass === BucketClass.PUBLIC
        ? this.configService.get<string>('r2.publicBucket') || 'gec-public-media-dev'
        : this.configService.get<string>('r2.privateBucket') || 'gec-private-submissions-dev';

    // Verify object exists if R2 is active
    if (this.s3Client) {
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: bucket,
          Key: dto.r2Key,
        });
        await this.s3Client.send(headCommand);
      } catch (err: any) {
        throw new BadRequestException(`Failed to verify object in R2: ${err.message}`);
      }
    }

    const assetId = uuidv4();
    const publicBase = this.configService.get<string>('r2.publicBaseUrl') || 'https://media.gec.org';
    const publicUrl =
      dto.bucketClass === BucketClass.PUBLIC ? `${publicBase}/${dto.r2Key}` : null;

    await this.coreDb.query(
      `INSERT INTO media_assets (id, bucket_class, r2_key, mime_type, byte_size, original_filename, public_url, purpose, uploader_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'finalized', NOW(), NOW())`,
      [
        assetId,
        dto.bucketClass,
        dto.r2Key,
        dto.mimeType,
        dto.byteSize,
        dto.originalFilename,
        publicUrl,
        dto.purpose || null,
        actorId || null,
      ],
    );

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

  async getDownloadUrl(r2Key: string, actorId: string) {
    const res = await this.coreDb.query('SELECT * FROM media_assets WHERE r2_key = $1', [r2Key]);
    const asset = res.rows[0];

    if (!asset) {
      throw new NotFoundException(`Media asset '${r2Key}' not found.`);
    }

    if (asset.bucket_class === BucketClass.PUBLIC && asset.public_url) {
      return { downloadUrl: asset.public_url, isPublic: true };
    }

    const bucket = this.configService.get<string>('r2.privateBucket') || 'gec-private-submissions-dev';
    let downloadUrl: string;

    if (this.s3Client) {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: r2Key,
      });
      downloadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
    } else {
      downloadUrl = `http://localhost:4000/media-mock/download/${r2Key}?token=mock_signed_download_token`;
    }

    return {
      downloadUrl,
      isPublic: false,
      expiresInSeconds: 300,
    };
  }

  async listMedia(bucketClass?: BucketClass, purpose?: string) {
    const res = await this.coreDb.query(
      `SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 100`,
    );
    let items = res.rows;
    if (bucketClass) items = items.filter((m) => m.bucket_class === bucketClass);
    if (purpose) items = items.filter((m) => m.purpose === purpose);
    return items;
  }
}

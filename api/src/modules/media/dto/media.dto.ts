import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BucketClass {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class PresignUploadDto {
  @ApiProperty({ example: 'hero-banner.jpg' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 2097152, description: 'File size in bytes (max 100MB)' })
  @IsNumber()
  @Max(104857600) // 100MB max
  byteSize: number;

  @ApiProperty({ enum: BucketClass, example: BucketClass.PUBLIC })
  @IsEnum(BucketClass)
  bucketClass: BucketClass;

  @ApiProperty({ example: 'hero_spotlight', required: false })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiProperty({ example: 'hero', required: false })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({ example: 'e3b0c442-98fc-1c14-9afb-4c7fa3701234', required: false })
  @IsString()
  @IsOptional()
  entityId?: string;
}

export class CompleteUploadDto {
  @ApiProperty({ example: 'public/hero/e3b0c442/asset-123/v1-hero-banner.jpg' })
  @IsString()
  @IsNotEmpty()
  r2Key: string;

  @ApiProperty({ enum: BucketClass, example: BucketClass.PUBLIC })
  @IsEnum(BucketClass)
  bucketClass: BucketClass;

  @ApiProperty({ example: 'hero-banner.jpg' })
  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 2097152 })
  @IsNumber()
  byteSize: number;

  @ApiProperty({ example: 'hero_spotlight', required: false })
  @IsString()
  @IsOptional()
  purpose?: string;
}

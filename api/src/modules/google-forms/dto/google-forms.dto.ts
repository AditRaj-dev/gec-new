import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GoogleFormLifecycleState {
  PROPOSED = 'proposed',
  UNPUBLISHED = 'unpublished',
  NEEDS_MANUAL_UPLOAD_SETUP = 'needs_manual_upload_setup',
  READY_FOR_REVIEW = 'ready_for_review',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  FAILED = 'failed',
  EXTERNAL_MISSING = 'external_missing',
}

export class CreateFormFromPlanDto {
  @ApiProperty({ description: 'ID of validated GoogleFormPlan' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'idemp_form_create_123' })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}

export class UpdateGoogleFormDto {
  @ApiProperty({ description: 'Current Google revision ID for concurrency check' })
  @IsString()
  @IsNotEmpty()
  currentRevisionId: string;

  @ApiProperty({ example: 'Updated Form Title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  items?: any[];

  @ApiProperty({ example: 'idemp_form_update_123' })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}

export class VerifyManualStepsDto {
  @ApiProperty({ description: 'Optional list of observed Google item IDs if known' })
  @IsArray()
  @IsOptional()
  observedItemIds?: string[];
}

export class SheetExportDto {
  @ApiProperty({ example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' })
  @IsString()
  @IsNotEmpty()
  spreadsheetId: string;

  @ApiProperty({ example: 'SDP_2026_v1' })
  @IsString()
  @IsNotEmpty()
  tabName: string;

  @ApiProperty({ example: 'idemp_export_123' })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}

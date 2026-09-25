import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum WorkflowState {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

export class CreateContentDraftDto {
  @ApiProperty({ example: 'initiatives' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ example: 'startup-development-program-2026' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Startup Development Program 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: { summary: 'Flagship pre-incubation program' } })
  @IsObject()
  data: Record<string, any>;
}

export class UpdateContentDraftDto {
  @ApiProperty({ example: 1, description: 'Expected version for optimistic concurrency control' })
  @IsNumber()
  @IsNotEmpty()
  version: number;

  @ApiProperty({ example: 'Updated Title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'updated-slug' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class TransitionWorkflowDto {
  @ApiProperty({ enum: WorkflowState, example: WorkflowState.IN_REVIEW })
  @IsEnum(WorkflowState)
  workflowState: WorkflowState;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  scheduledPublishAt?: string;
}

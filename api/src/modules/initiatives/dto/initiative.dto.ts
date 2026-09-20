import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInitiativeDto {
  @ApiProperty({ example: 'startup-development-program-2026' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Startup Development Program 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Flagship pre-incubation and startup accelerator by GEC' })
  @IsString()
  @IsNotEmpty()
  tagline: string;

  @ApiProperty({ example: 'Overview of the program...', required: false })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({ example: [{ phase: 'Phase 1: Ideation', date: 'Oct 2026' }], required: false })
  @IsArray()
  @IsOptional()
  timeline?: Record<string, any>[];

  @ApiProperty({ example: ['Enrolled university student', 'Early-stage prototype'], required: false })
  @IsArray()
  @IsOptional()
  eligibility?: string[];

  @ApiProperty({ example: [{ question: 'Who can apply?', answer: 'Anyone with an innovative idea' }], required: false })
  @IsArray()
  @IsOptional()
  faqs?: Record<string, string>[];

  @ApiProperty({ example: [{ type: 'text', content: 'Detailed curriculum...' }], required: false })
  @IsArray()
  @IsOptional()
  contentBlocks?: Record<string, any>[];

  @ApiProperty({ example: { label: 'Apply Now', link: '/apply/sdp-2026', deadline: '2026-10-31T23:59:59Z' }, required: false })
  @IsObject()
  @IsOptional()
  cta?: Record<string, any>;
}

export class UpdateInitiativeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  timeline?: Record<string, any>[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  eligibility?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  faqs?: Record<string, string>[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  contentBlocks?: Record<string, any>[];

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  cta?: Record<string, any>;
}

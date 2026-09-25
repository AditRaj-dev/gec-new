import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StoryCategory {
  NEWS = 'news',
  FOUNDER_STORIES = 'founder_stories',
  STARTUP_STORIES = 'startup_stories',
  EVENT_STORIES = 'event_stories',
  FEATURED_STORIES = 'featured_stories',
}

export class CreateStoryDto {
  @ApiProperty({ example: 'how-student-startup-raised-pre-seed' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'How a Student Team Raised Pre-Seed through GEC Incubator' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: StoryCategory, example: StoryCategory.STARTUP_STORIES })
  @IsEnum(StoryCategory)
  category: StoryCategory;

  @ApiProperty({ example: 'An inspiring journey of campus entrepreneurs...' })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiProperty({ example: 'Full rich markdown or html story body...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://media.gec.org/story-cover.jpg', required: false })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ example: 'Alex Smith', required: false })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ example: ['incubation', 'funding', 'students'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateStoryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ enum: StoryCategory, required: false })
  @IsEnum(StoryCategory)
  @IsOptional()
  category?: StoryCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

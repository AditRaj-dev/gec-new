import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PersonCategory {
  LEADERSHIP = 'leadership',
  MENTORS = 'mentors',
  TEAM_HEADS = 'team_heads',
  COORDINATORS = 'coordinators',
  MEMBERS = 'members',
  ALUMNI = 'alumni',
}

export class CreatePersonDto {
  @ApiProperty({ example: 'Dr. Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: PersonCategory, example: PersonCategory.LEADERSHIP })
  @IsEnum(PersonCategory)
  category: PersonCategory;

  @ApiProperty({ example: 'Faculty Mentor & Strategic Advisor' })
  @IsString()
  @IsNotEmpty()
  roleTitle: string;

  @ApiProperty({ example: 'team_01', required: false })
  @IsString()
  @IsOptional()
  teamScope?: string;

  @ApiProperty({ example: 'https://media.gec.org/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: 'Executive bio and achievements', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: { linkedin: 'https://linkedin.com/in/janedoe' }, required: false })
  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class UpdatePersonDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: PersonCategory, required: false })
  @IsEnum(PersonCategory)
  @IsOptional()
  category?: PersonCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  roleTitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  teamScope?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  socialLinks?: Record<string, string>;
}

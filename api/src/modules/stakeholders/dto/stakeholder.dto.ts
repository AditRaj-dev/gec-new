import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StakeholderType {
  PARTNER = 'partner',
  SPEAKER = 'speaker',
  STARTUP = 'startup',
  ALUMNI = 'alumni',
}

export class CreateStakeholderDto {
  @ApiProperty({ example: 'AWS for Startups' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: StakeholderType, example: StakeholderType.PARTNER })
  @IsEnum(StakeholderType)
  type: StakeholderType;

  @ApiProperty({ example: 'Cloud Infrastructure Partner', required: false })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ example: 'https://media.gec.org/partners/aws.png', required: false })
  @IsString()
  @IsOptional()
  logoOrAvatarUrl?: string;

  @ApiProperty({ example: 'https://aws.amazon.com', required: false })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ example: 'Providing $5,000 AWS cloud credits to incubation cohorts', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateStakeholderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: StakeholderType, required: false })
  @IsEnum(StakeholderType)
  @IsOptional()
  type?: StakeholderType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoOrAvatarUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

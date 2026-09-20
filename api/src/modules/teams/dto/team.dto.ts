import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'team_01' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Corporate Relations & Sponsorships' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Securing corporate partnerships, industry tie-ups and event sponsors' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: { name: 'John Doe', role: 'Head' }, required: false })
  @IsOptional()
  head?: Record<string, any>;

  @ApiProperty({ example: [{ name: 'Coordinator 1' }], required: false })
  @IsArray()
  @IsOptional()
  coordinators?: Record<string, any>[];

  @ApiProperty({ example: [{ name: 'Member 1' }], required: false })
  @IsArray()
  @IsOptional()
  members?: Record<string, any>[];

  @ApiProperty({ example: ['Pitching to corporate CXOs', 'Sponsorship contracts'], required: false })
  @IsArray()
  @IsOptional()
  responsibilities?: string[];

  @ApiProperty({ example: { acceptsApplications: true }, required: false })
  @IsObject()
  @IsOptional()
  recruitmentSettings?: Record<string, any>;
}

export class UpdateTeamDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  head?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  coordinators?: Record<string, any>[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  members?: Record<string, any>[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  responsibilities?: string[];

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  recruitmentSettings?: Record<string, any>;
}

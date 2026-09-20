import { IsString, IsNotEmpty, IsEmail, IsOptional, IsObject, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SubmissionType {
  INITIATIVE_APPLICATION = 'initiative_application',
  RECRUITMENT = 'recruitment',
  PITCH = 'pitch',
  CONTACT = 'contact',
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export class CreatePublicSubmissionDto {
  @ApiProperty({ enum: SubmissionType, example: SubmissionType.INITIATIVE_APPLICATION })
  @IsEnum(SubmissionType)
  submissionType: SubmissionType;

  @ApiProperty({ example: 'e3b0c442-98fc-1c14-9afb-4c7fa3701234', required: false })
  @IsString()
  @IsOptional()
  targetEntityId?: string;

  @ApiProperty({ example: 'Rohan Sharma' })
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @ApiProperty({ example: 'rohan.sharma@galgotiasuniversity.edu.in' })
  @IsEmail()
  @IsNotEmpty()
  applicantEmail: string;

  @ApiProperty({ example: '+91 9876543210', required: false })
  @IsString()
  @IsOptional()
  applicantPhone?: string;

  @ApiProperty({ example: { startupName: 'EdVenture', description: 'AI tutor for STEM' } })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;

  @ApiProperty({ example: ['private/submissions/pitch-deck.pdf'], required: false })
  @IsArray()
  @IsOptional()
  attachmentKeys?: string[];
}

export class UpdateSubmissionStatusDto {
  @ApiProperty({ enum: SubmissionStatus, example: SubmissionStatus.SHORTLISTED })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiProperty({ example: 'Passed preliminary evaluation round', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

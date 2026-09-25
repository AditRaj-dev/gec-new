import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreatePublicSubmissionDto } from './dto/submission.dto';

@ApiTags('Public Submissions')
@Controller('v1/public/submissions')
export class PublicSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit initiative application, join team, pitch, or contact request' })
  @ApiResponse({ status: 201, description: 'Submission received' })
  async create(@Body() dto: CreatePublicSubmissionDto) {
    return this.submissionsService.createPublic(dto);
  }
}

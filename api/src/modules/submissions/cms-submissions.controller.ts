import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProduces } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import {
  UpdateSubmissionStatusDto,
  SubmissionType,
  SubmissionStatus,
} from './dto/submission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Submissions & Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/submissions')
export class CmsSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  @RequirePermissions(Permission.SUBMISSIONS_READ)
  @ApiOperation({ summary: 'List and filter submissions' })
  async list(
    @Query('type') type?: SubmissionType,
    @Query('status') status?: SubmissionStatus,
    @Query('limit') limit?: number,
  ) {
    return this.submissionsService.list({ submissionType: type, status, limit });
  }

  @Get('export/csv')
  @RequirePermissions(Permission.SUBMISSIONS_EXPORT)
  @ApiOperation({ summary: 'Export submissions to CSV' })
  @ApiProduces('text/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="gec_submissions.csv"')
  async exportCsv(
    @Query('type') type: SubmissionType | undefined,
    @Res() res: Response,
  ) {
    const csv = await this.submissionsService.exportCsv(type);
    return res.send(csv);
  }

  @Get(':id')
  @RequirePermissions(Permission.SUBMISSIONS_READ)
  @ApiOperation({ summary: 'Get submission details by ID' })
  async get(@Param('id') id: string) {
    return this.submissionsService.get(id);
  }

  @Patch(':id/status')
  @RequirePermissions(Permission.SUBMISSIONS_MANAGE)
  @ApiOperation({ summary: 'Update submission workflow status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.submissionsService.updateStatus(id, dto, user.id);
  }
}

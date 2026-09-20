import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoogleFormsService } from './google-forms.service';
import {
  CreateFormFromPlanDto,
  UpdateGoogleFormDto,
  SheetExportDto,
} from './dto/google-forms.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Google Forms Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/google-forms')
export class GoogleFormsController {
  constructor(private readonly formsService: GoogleFormsService) {}

  @Post('plans')
  @RequirePermissions(Permission.FORMS_CREATE)
  @ApiOperation({ summary: 'Submit and validate structured GoogleFormPlan' })
  async createPlan(
    @Body() plan: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.createPlan(plan, user.id);
  }

  @Get()
  @RequirePermissions(Permission.FORMS_READ)
  @ApiOperation({ summary: 'List managed Google Forms' })
  async listForms() {
    return this.formsService.listForms();
  }

  @Get(':id')
  @RequirePermissions(Permission.FORMS_READ)
  @ApiOperation({ summary: 'Get Google Form registry, latest revision, and manual requirements' })
  async getForm(@Param('id') id: string) {
    return this.formsService.getForm(id);
  }

  @Post()
  @RequirePermissions(Permission.FORMS_CREATE)
  @ApiOperation({ summary: 'Create unpublished Google Form from validated plan' })
  async createForm(
    @Body() dto: CreateFormFromPlanDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.createFormFromPlan(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.FORMS_EDIT)
  @ApiOperation({ summary: 'Apply reviewed update with Google revision conflict check' })
  async updateForm(
    @Param('id') id: string,
    @Body() dto: UpdateGoogleFormDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.updateForm(id, dto, user.id);
  }

  @Post(':id/verify-manual-steps')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.FORMS_EDIT)
  @ApiOperation({ summary: 'Verify manual file-upload questions configured in Google editor' })
  async verifyManualSteps(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.verifyManualSteps(id, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.FORMS_PUBLISH)
  @ApiOperation({ summary: 'Separately confirm publication of verified Google Form' })
  async publishForm(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.publishForm(id, user.id);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.FORMS_PUBLISH)
  @ApiOperation({ summary: 'Close Google Form to stop accepting responses' })
  async closeForm(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.closeForm(id, user.id);
  }

  @Post(':id/responses/sync')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.FORMS_RESPONSES_READ)
  @ApiOperation({ summary: 'Trigger on-demand response cache synchronization' })
  async syncResponses(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.syncResponses(id, user.id);
  }

  @Get(':id/responses')
  @RequirePermissions(Permission.FORMS_RESPONSES_READ)
  @ApiOperation({ summary: 'Filter and inspect cached responses' })
  async getResponses(@Param('id') id: string) {
    return this.formsService.getCachedResponses(id);
  }

  @Post(':id/sheet-export')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.FORMS_RESPONSES_EXPORT)
  @ApiOperation({ summary: 'Manually export unexported responses to configured Google Sheet tab' })
  async exportToSheet(
    @Param('id') id: string,
    @Body() dto: SheetExportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.formsService.exportToSheet(id, dto, user.id);
  }
}

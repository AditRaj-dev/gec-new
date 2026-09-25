import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ContentService } from './content.service';
import {
  CreateContentDraftDto,
  UpdateContentDraftDto,
  TransitionWorkflowDto,
} from './dto/content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Content Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/content')
export class CmsContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @RequirePermissions(Permission.CONTENT_EDIT)
  @ApiOperation({ summary: 'Create new content draft document' })
  async createDraft(
    @Body() dto: CreateContentDraftDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contentService.createDraft(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.CONTENT_READ)
  @ApiOperation({ summary: 'List draft documents' })
  async listDrafts(@Query('entityType') entityType?: string) {
    return this.contentService.listDrafts(entityType);
  }

  @Get(':id')
  @RequirePermissions(Permission.CONTENT_READ)
  @ApiOperation({ summary: 'Get draft document by ID' })
  async getDraft(@Param('id') id: string) {
    return this.contentService.getDraft(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.CONTENT_EDIT)
  @ApiOperation({ summary: 'Update draft document with optimistic concurrency check' })
  @ApiHeader({ name: 'If-Match', required: false, description: 'Expected version number' })
  async updateDraft(
    @Param('id') id: string,
    @Body() dto: UpdateContentDraftDto,
    @Headers('if-match') ifMatch?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const parsedIfMatch = ifMatch ? parseInt(ifMatch, 10) : undefined;
    return this.contentService.updateDraft(id, dto, parsedIfMatch, user?.id);
  }

  @Post(':id/workflow')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_EDIT)
  @ApiOperation({ summary: 'Transition content workflow state' })
  async transitionWorkflow(
    @Param('id') id: string,
    @Body() dto: TransitionWorkflowDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contentService.transitionWorkflow(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish content snapshot idempotently' })
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  async publish(
    @Param('id') id: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contentService.publish(id, idempotencyKey, user.id);
  }
}

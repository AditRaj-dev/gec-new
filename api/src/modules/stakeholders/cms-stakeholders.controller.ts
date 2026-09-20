import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StakeholdersService } from './stakeholders.service';
import { CreateStakeholderDto, UpdateStakeholderDto, StakeholderType } from './dto/stakeholder.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Stakeholders (Partners, Speakers, Startups, Alumni)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/stakeholders')
export class CmsStakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Post()
  @RequirePermissions(Permission.STAKEHOLDERS_EDIT)
  @ApiOperation({ summary: 'Create stakeholder profile' })
  async create(
    @Body() dto: CreateStakeholderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.stakeholdersService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.STAKEHOLDERS_READ)
  @ApiOperation({ summary: 'List stakeholders in CMS' })
  async list(@Query('type') type?: StakeholderType) {
    return this.stakeholdersService.list(type);
  }

  @Get(':id')
  @RequirePermissions(Permission.STAKEHOLDERS_READ)
  @ApiOperation({ summary: 'Get stakeholder draft by ID' })
  async get(@Param('id') id: string) {
    return this.stakeholdersService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.STAKEHOLDERS_EDIT)
  @ApiOperation({ summary: 'Update stakeholder profile' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStakeholderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.stakeholdersService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish stakeholder snapshot' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.stakeholdersService.publish(id, user.id);
  }
}

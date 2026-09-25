import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Initiatives Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/initiatives')
export class CmsInitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Post()
  @RequirePermissions(Permission.INITIATIVES_EDIT)
  @ApiOperation({ summary: 'Create initiative draft' })
  async create(
    @Body() dto: CreateInitiativeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.initiativesService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.INITIATIVES_READ)
  @ApiOperation({ summary: 'List initiatives' })
  async list() {
    return this.initiativesService.list();
  }

  @Get(':id')
  @RequirePermissions(Permission.INITIATIVES_READ)
  @ApiOperation({ summary: 'Get initiative draft by ID' })
  async get(@Param('id') id: string) {
    return this.initiativesService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.INITIATIVES_EDIT)
  @ApiOperation({ summary: 'Update initiative draft' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInitiativeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.initiativesService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish initiative snapshot' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.initiativesService.publish(id, user.id);
  }
}

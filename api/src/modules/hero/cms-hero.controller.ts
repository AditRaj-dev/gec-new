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
import { HeroService } from './hero.service';
import { CreateHeroSpotlightDto, UpdateHeroSpotlightDto } from './dto/hero-spotlight.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Hero Spotlight')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/hero')
export class CmsHeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @RequirePermissions(Permission.HERO_MANAGE)
  @ApiOperation({ summary: 'Create campaign for Hero Spotlight (P0-P2 priority)' })
  async create(
    @Body() dto: CreateHeroSpotlightDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.heroService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.HERO_MANAGE)
  @ApiOperation({ summary: 'List all hero spotlight campaigns' })
  async list() {
    return this.heroService.list();
  }

  @Get(':id')
  @RequirePermissions(Permission.HERO_MANAGE)
  @ApiOperation({ summary: 'Get hero campaign by ID' })
  async get(@Param('id') id: string) {
    return this.heroService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.HERO_MANAGE)
  @ApiOperation({ summary: 'Update hero spotlight campaign' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHeroSpotlightDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.heroService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish hero spotlight snapshot to live website' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.heroService.publish(id, user.id);
  }
}

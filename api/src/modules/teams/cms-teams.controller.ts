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
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TeamScopeGuard } from '../../common/guards/team-scope.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CheckTeamScope } from '../../common/decorators/team-scope.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Teams Management (01-07)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard, TeamScopeGuard)
@Controller('v1/cms/teams')
export class CmsTeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @RequirePermissions(Permission.TEAMS_EDIT)
  @ApiOperation({ summary: 'Create team definition' })
  async create(
    @Body() dto: CreateTeamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.TEAMS_READ)
  @ApiOperation({ summary: 'List all teams in CMS' })
  async list() {
    return this.teamsService.list();
  }

  @Get(':id')
  @RequirePermissions(Permission.TEAMS_READ)
  @CheckTeamScope('id')
  @ApiOperation({ summary: 'Get team details' })
  async get(@Param('id') id: string) {
    return this.teamsService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.TEAMS_EDIT)
  @CheckTeamScope('id')
  @ApiOperation({ summary: 'Update team details and members' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish team profile' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.publish(id, user.id);
  }
}

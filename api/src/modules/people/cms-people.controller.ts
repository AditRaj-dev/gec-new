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
import { PeopleService } from './people.service';
import { CreatePersonDto, UpdatePersonDto, PersonCategory } from './dto/person.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS People & Leadership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/people')
export class CmsPeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @RequirePermissions(Permission.PEOPLE_EDIT)
  @ApiOperation({ summary: 'Create person profile (leadership, mentor, member, etc.)' })
  async create(
    @Body() dto: CreatePersonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.peopleService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.PEOPLE_READ)
  @ApiOperation({ summary: 'List people profiles in CMS' })
  async list(@Query('category') category?: PersonCategory) {
    return this.peopleService.list(category);
  }

  @Get(':id')
  @RequirePermissions(Permission.PEOPLE_READ)
  @ApiOperation({ summary: 'Get person profile by ID' })
  async get(@Param('id') id: string) {
    return this.peopleService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.PEOPLE_EDIT)
  @ApiOperation({ summary: 'Update person profile' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePersonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.peopleService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish person profile snapshot' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.peopleService.publish(id, user.id);
  }
}

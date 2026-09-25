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
import { StoriesService } from './stories.service';
import { CreateStoryDto, UpdateStoryDto, StoryCategory } from './dto/story.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Stories Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/stories')
export class CmsStoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @RequirePermissions(Permission.STORIES_EDIT)
  @ApiOperation({ summary: 'Create story draft' })
  async create(
    @Body() dto: CreateStoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storiesService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.STORIES_READ)
  @ApiOperation({ summary: 'List stories in CMS' })
  async list(@Query('category') category?: StoryCategory) {
    return this.storiesService.list(category);
  }

  @Get(':id')
  @RequirePermissions(Permission.STORIES_READ)
  @ApiOperation({ summary: 'Get story draft by ID' })
  async get(@Param('id') id: string) {
    return this.storiesService.get(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.STORIES_EDIT)
  @ApiOperation({ summary: 'Update story draft' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storiesService.update(id, dto, user.id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  @ApiOperation({ summary: 'Publish story snapshot' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storiesService.publish(id, user.id);
  }
}

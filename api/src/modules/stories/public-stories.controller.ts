import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { StoryCategory } from './dto/story.dto';

@ApiTags('Public Stories')
@Controller('v1/public/stories')
export class PublicStoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List published stories' })
  @ApiResponse({ status: 200, description: 'Published stories list' })
  async listPublic(@Query('category') category?: StoryCategory) {
    return this.storiesService.listPublic(category);
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get published story details' })
  @ApiResponse({ status: 200, description: 'Published story details' })
  @ApiResponse({ status: 404, description: 'Story not found or not published' })
  async getPublic(@Param('slugOrId') slugOrId: string) {
    return this.storiesService.getPublic(slugOrId);
  }
}

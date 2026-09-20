import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Public Published Content')
@Controller('v1/public/content')
export class PublicContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':entityType')
  @ApiOperation({ summary: 'List published active entities' })
  @ApiResponse({ status: 200, description: 'Published entities list' })
  async listPublicContent(@Param('entityType') entityType: string) {
    return this.contentService.listPublicContent(entityType);
  }

  @Get(':entityType/:slugOrId')
  @ApiOperation({ summary: 'Get published snapshot projection by slug or ID' })
  @ApiResponse({ status: 200, description: 'Published content snapshot' })
  @ApiResponse({ status: 404, description: 'Content not found or not published' })
  async getPublicContent(
    @Param('entityType') entityType: string,
    @Param('slugOrId') slugOrId: string,
  ) {
    return this.contentService.getPublicContent(entityType, slugOrId);
  }
}

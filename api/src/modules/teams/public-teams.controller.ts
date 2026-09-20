import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';

@ApiTags('Public Teams Directory')
@Controller('v1/public/teams')
export class PublicTeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'List published teams (01-07)' })
  @ApiResponse({ status: 200, description: 'Published teams list' })
  async listPublic() {
    return this.teamsService.listPublic();
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get published team details' })
  @ApiResponse({ status: 200, description: 'Published team projection' })
  @ApiResponse({ status: 404, description: 'Team not found or not published' })
  async getPublic(@Param('slugOrId') slugOrId: string) {
    return this.teamsService.getPublic(slugOrId);
  }
}

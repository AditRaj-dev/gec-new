import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StakeholdersService } from './stakeholders.service';
import { StakeholderType } from './dto/stakeholder.dto';

@ApiTags('Public Stakeholders')
@Controller('v1/public/stakeholders')
export class PublicStakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Get()
  @ApiOperation({ summary: 'List published stakeholders' })
  @ApiResponse({ status: 200, description: 'Published stakeholders list' })
  async listPublic(@Query('type') type?: StakeholderType) {
    return this.stakeholdersService.listPublic(type);
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get published stakeholder profile' })
  @ApiResponse({ status: 200, description: 'Published stakeholder profile' })
  @ApiResponse({ status: 404, description: 'Stakeholder not found or not published' })
  async getPublic(@Param('slugOrId') slugOrId: string) {
    return this.stakeholdersService.getPublic(slugOrId);
  }
}

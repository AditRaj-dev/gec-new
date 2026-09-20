import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';

@ApiTags('Public Initiatives')
@Controller('v1/public/initiatives')
export class PublicInitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Get()
  @ApiOperation({ summary: 'List published initiatives' })
  @ApiResponse({ status: 200, description: 'Published initiatives list' })
  async listPublic() {
    return this.initiativesService.listPublic();
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get published initiative details' })
  @ApiResponse({ status: 200, description: 'Published initiative details' })
  @ApiResponse({ status: 404, description: 'Initiative not found or not published' })
  async getPublic(@Param('slugOrId') slugOrId: string) {
    return this.initiativesService.getPublic(slugOrId);
  }
}

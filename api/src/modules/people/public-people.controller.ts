import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { PersonCategory } from './dto/person.dto';

@ApiTags('Public People Directory')
@Controller('v1/public/people')
export class PublicPeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @ApiOperation({ summary: 'List published people (leadership, mentors, etc.)' })
  @ApiResponse({ status: 200, description: 'Published people list' })
  async listPublic(@Query('category') category?: PersonCategory) {
    return this.peopleService.listPublic(category);
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get published person profile' })
  @ApiResponse({ status: 200, description: 'Published person projection' })
  @ApiResponse({ status: 404, description: 'Person not found or not published' })
  async getPublic(@Param('slugOrId') slugOrId: string) {
    return this.peopleService.getPublic(slugOrId);
  }
}

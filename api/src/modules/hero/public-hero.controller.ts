import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HeroService } from './hero.service';

@ApiTags('Public Hero Spotlight')
@Controller('v1/public/hero')
export class PublicHeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  @ApiOperation({ summary: 'Get current active hero spotlight (or evergreen fallback)' })
  @ApiResponse({ status: 200, description: 'Active hero billboard projection' })
  async getActiveHero() {
    return this.heroService.getActiveHero();
  }
}

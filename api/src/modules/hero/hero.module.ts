import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CmsHeroController } from './cms-hero.controller';
import { PublicHeroController } from './public-hero.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsHeroController, PublicHeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}

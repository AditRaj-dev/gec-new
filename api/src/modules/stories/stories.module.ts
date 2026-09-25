import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CmsStoriesController } from './cms-stories.controller';
import { PublicStoriesController } from './public-stories.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsStoriesController, PublicStoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}

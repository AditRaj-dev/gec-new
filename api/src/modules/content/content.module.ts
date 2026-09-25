import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { CmsContentController } from './cms-content.controller';
import { PublicContentController } from './public-content.controller';

@Module({
  controllers: [CmsContentController, PublicContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}

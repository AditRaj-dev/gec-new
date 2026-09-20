import { Module } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { CmsInitiativesController } from './cms-initiatives.controller';
import { PublicInitiativesController } from './public-initiatives.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsInitiativesController, PublicInitiativesController],
  providers: [InitiativesService],
  exports: [InitiativesService],
})
export class InitiativesModule {}

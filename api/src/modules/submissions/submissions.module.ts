import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CmsSubmissionsController } from './cms-submissions.controller';
import { PublicSubmissionsController } from './public-submissions.controller';

@Module({
  controllers: [CmsSubmissionsController, PublicSubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}

import { Module } from '@nestjs/common';
import { StakeholdersService } from './stakeholders.service';
import { CmsStakeholdersController } from './cms-stakeholders.controller';
import { PublicStakeholdersController } from './public-stakeholders.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsStakeholdersController, PublicStakeholdersController],
  providers: [StakeholdersService],
  exports: [StakeholdersService],
})
export class StakeholdersModule {}

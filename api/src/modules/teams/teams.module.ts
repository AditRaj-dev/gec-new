import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CmsTeamsController } from './cms-teams.controller';
import { PublicTeamsController } from './public-teams.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsTeamsController, PublicTeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CmsPeopleController } from './cms-people.controller';
import { PublicPeopleController } from './public-people.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CmsPeopleController, PublicPeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}

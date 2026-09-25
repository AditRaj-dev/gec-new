import { Module, Global } from '@nestjs/common';
import { FormsDatabaseService } from './forms-database.service';

@Global()
@Module({
  providers: [FormsDatabaseService],
  exports: [FormsDatabaseService],
})
export class FormsDatabaseModule {}

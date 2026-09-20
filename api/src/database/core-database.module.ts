import { Module, Global } from '@nestjs/common';
import { CoreDatabaseService } from './core-database.service';

@Global()
@Module({
  providers: [CoreDatabaseService],
  exports: [CoreDatabaseService],
})
export class CoreDatabaseModule {}

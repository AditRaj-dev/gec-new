import { Module } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { CopilotToolsService } from './copilot-tools.service';
import { CopilotController } from './copilot.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [CopilotController],
  providers: [CopilotService, CopilotToolsService],
  exports: [CopilotService, CopilotToolsService],
})
export class CopilotModule {}

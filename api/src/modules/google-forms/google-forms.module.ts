import { Module } from '@nestjs/common';
import { GoogleFormsService } from './google-forms.service';
import { GoogleFormsController } from './google-forms.controller';

@Module({
  controllers: [GoogleFormsController],
  providers: [GoogleFormsService],
  exports: [GoogleFormsService],
})
export class GoogleFormsModule {}

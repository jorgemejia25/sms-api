import { InfoModule } from './../info/info.module';
import { InfoService } from './../info/info.service';
import { Module } from '@nestjs/common';
import { ReceiveController } from './receive.controller';
import { ReceiveService } from './receive.service';
import { SmsService } from '../sms/sms.service';

@Module({
  controllers: [ReceiveController],
  providers: [ReceiveService, SmsService],
  imports: [InfoModule],
})
export class ReceiveModule {}

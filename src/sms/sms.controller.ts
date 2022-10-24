import { Get, Query } from '@nestjs/common/decorators';

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmsService } from './sms.service';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private smsService: SmsService) {}

  /*
   * @param inbox
   * @returns information about the SMS
   */
  @Get('inbox')
  async getTest(@Query() query: any) {
    return await this.smsService.getInbox({
      phonenumber: query.key[0],
      port: query.key[1],
      portname: query.key[2],
      message: query.key[3],
      time: query.key[4],
    });
  }
}

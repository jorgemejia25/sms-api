import { InfoService } from 'src/info/info.service';
import { Controller } from '@nestjs/common';
import { Body, Param, Post, Query } from '@nestjs/common/decorators';
import { ReceiveService } from './receive.service';
import { Message } from '../interfaces/Message';
import { SmsService } from '../sms/sms.service';
import { Reports, ReportsResponse } from 'src/interfaces/Reports';
import { SMSDto } from '../sms/dtos/sms.dto';

@Controller('receive')
export class ReceiveController {
  constructor(
    private receiveService: ReceiveService,
    private infoService: InfoService,
  ) {}

  @Post('message')
  async getInbox(@Body() body: Message) {
    return this.receiveService.sendMessageToAPI({
      message: body.message.text,
      phonenumber: body.contactId,
    });
  }

  @Post('rr/message')
  async getInboxRR(@Body() body: Message) {
    return this.receiveService.sendMessageToAPI({
      message: body.message.text,
      phonenumber: body.contactId,
      port: this.infoService.roundRobinPortASC(),
    });
  } 
  
  @Post('rr/asc/message')
  async getInboxAsc(@Body() body: Message) {
    return this.receiveService.sendMessageToAPI({
      message: body.message.text,
      phonenumber: body.contactId,
      port: this.infoService.roundRobinPortASC(),
    });
  }

  @Post('rr/desc/message')
  async getInboxDesc(@Body() body: Message) {
    return this.receiveService.sendMessageToAPI({
      message: body.message.text,
      phonenumber: body.contactId,
      port: this.infoService.roundRobinPortDESC(),
    });
  }

  @Post(':port/message')
  async newMessage(
    @Body() body: Message,
    @Param('port') port: string,
  ): Promise<ReportsResponse> {
    return this.receiveService.sendMessageToAPI({
      message: body.message.text,
      phonenumber: body.contactId,
      port: parseInt(port),
    });
  }
}

import { Reports, ReportsResponse } from 'src/interfaces/Reports';

import { ConfigService } from '@nestjs/config/dist';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/interfaces/Message';
import { SMSDto } from '../sms/dtos/sms.dto';
import { SmsService } from '../sms/sms.service';

const axios = require('axios');

@Injectable()
export class ReceiveService {
  constructor(
    private smsService: SmsService,
    private configService: ConfigService,
  ) {}

  /**
   * Send the message to the API, via the SMS service
   * @param {SMSDto} message the message to send
   * @returns {Promise<ReportsResponse>} the response from the API
   */
  async sendMessageToAPI(message: SMSDto): Promise<ReportsResponse> {
    // Call the API via the SMS service

    console.log(message);

    try {
      const { reports }: any = await this.smsService.sendSMS({
        message: message.message,
        phonenumber: message.phonenumber,
        username: this.configService.get('mbox_user'),
        password: this.configService.get('mbox_password'),
        port: message.port,
      });

      console.log(Object.values(reports));

      const postRes = await axios.post(
        'https://hooks.chatapi.net/workflows/yUMZYLxOOcfB/tPOuncOqcLXS',
        {
          phone: message.phonenumber,
          status: 'Success',
        },
      );

      return {
        reports,
      };
    } catch (error) {
      console.log(error);

      const postRes = await axios.post(
        'https://hooks.chatapi.net/workflows/yUMZYLxOOcfB/tPOuncOqcLXS',
        {
          phone: message.phonenumber,
          status: 'Error',
        },
      );
    }
  }

  /**
   *
   * @param {Message} message
   * @returns
   */
  async getInbox(message: Message) {
    return await this.smsService.sendSMS({
      message: message.message.text,
      phonenumber: message.contactId,
      username: this.configService.get('mbox_user'),
      password: this.configService.get('mbox_password'),
    });
  }
}

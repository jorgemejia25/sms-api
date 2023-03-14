import { Reports, ReportsResponse } from 'src/interfaces/Reports';

import { ConfigService } from '@nestjs/config/dist';
import { InfoService } from 'src/info/info.service';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/interfaces/Message';
import { SMSDto } from '../sms/dtos/sms.dto';
import { SmsService } from '../sms/sms.service';

const axios = require('axios');

interface Report {
  port: string;
  phonenumber: string;
  time: string;
  id: string;
  result: string;
}

@Injectable()
export class ReceiveService {
  constructor(
    private smsService: SmsService,
    private configService: ConfigService,
    private infoService: InfoService,
  ) {}

  /**
   * Send the message to the API, via the SMS service
   * @param {SMSDto} message the message to send
   * @returns {Promise<ReportsResponse>} the response from the API
   */
  async sendMessageToAPI(message: SMSDto): Promise<ReportsResponse> {
    // Call the API via the SMS service
    const portInfo = this.infoService.getJSONPort(message.port);

    try {

      // check if the port is defined in json
      if (!portInfo) {
        throw new Error('Port not found');
      }

      // check if the port message limit is reached
      if (portInfo.restantes <= 0) {
        throw new Error('Port limit reached');
      }

      const { report }: any = await this.smsService.sendSMS({
        message: message.message,
        phonenumber: message.phonenumber,
        username: this.configService.get('mbox_user'),
        password: this.configService.get('mbox_password'),
        port: message.port,
      });

      const reports = Object.values(report[0]);

      const failedReports = reports.filter(
        (r: Report[]) => r[0].result === 'failed',
      );

      console.log(+reports[0][0].port);

      this.infoService.decrementRestantes(+reports[0][0].port);

      const postRes = await axios.post(
        'https://hooks.chatapi.net/workflows/yUMZYLxOOcfB/tPOuncOqcLXS',
        {
          phone: message.phonenumber,
          data: new Date().toISOString(),
          port: message.port,
          status: failedReports.length > 0 ? 'Error al enviar' : 'Éxito',
        },
      );

      return {
        port: message.port.toString(),
        date: new Date().toISOString(),
        report,
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

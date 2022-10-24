import { Reports, ReportsResponse } from 'src/interfaces/Reports';

import { ConfigService } from '@nestjs/config/dist';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/interfaces/Message';
import { SMSDto } from '../sms/dtos/sms.dto';
import { SmsService } from '../sms/sms.service';

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
    const response: any = await this.smsService.sendSMS({
      message: message.message,
      phonenumber: message.phonenumber,
      username: this.configService.get('mbox_user'),
      password: this.configService.get('mbox_password'),
      port: message.port,
    });

    // Parse the response
    const reports = response.report[0];
    const values: Reports[] = Object.values(reports).map((report) => report[0]);

    // Return the response
    if (values.filter((value) => value.result === 'fail').length > 0) {
      return {
        message: `${
          values.filter((value) => value.result === 'fail').length
        } mensajes enviados con error`,
        reports: values,
      };
    }

    return {
      message: `${values.length} mensajes enviados con éxito`,
      reports: values,
    };
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
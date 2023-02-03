import { ConfigService } from '@nestjs/config/dist';
import { Inbox } from '../interfaces/Inbox';
import { Injectable } from '@nestjs/common';
import { SMSDto } from './dtos/sms.dto';

// Axios typescript 1.1.0 error, no default export
const axios = require('axios');
@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  /**
   * Send SMS info when received
   * @param inbox
   * @returns information about the SMS
   * @example
   * {
   *  "status": "201",
   *  "phone": "50231293000",
   *  "message": "Hello World",
   *  "port": "1",
   * }
   */
  async getInbox(inbox: Inbox) {
    // Define the response data
    // Channel id: The channel id of the message, defined by the user on the .env file
    // Message: The message received
    // Contact id: The phone number that sent the message with the format 50299999999
    // Text: The message received

    const data = {
      channelId: this.configService.get('channel_id'),
      contactId: `+${inbox.phonenumber.replace('+', '')}`,
      events: [
        {
          type: 'message',
          mId: Date.now().toString(),
          timestamp: Date.now(),
          message: {
            type: 'text',
            text: inbox.message,
          },
        },
      ],
    };

    // Send the message to the channel
    // Authorization token defined on the .env file
    const res = await axios({
      method: 'post',
      url: this.configService.get('chatapi_url'),
      headers: {
        authorization: `Bearer ${this.configService.get('api_token')}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
      data,
    });

    return {
      status: res.status,
      phone: inbox.phonenumber,
      message: inbox.message,
      port: inbox.port,
    };
  }

  /**
   * Send SMS
   * @param sms
   * @returns AxiosResponse
   */
  async sendSMS(sms: SMSDto) {
    // Send sms via API

    const res = await axios.get(
      `${this.configService.get('mbox_url')}/sendsms`,
      {
        params: {
          username: sms.username,
          password: sms.password,
          phonenumber: sms.phonenumber,
          message: sms.message,
          port: sms.port,
          report: sms.report,
        },
      },
    );

    console.log(res.data);

    return res.data;
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@nestjs/config/dist';

/**
 * Middleware in order to validate apiToken
 * @param req
 * @param res
 * @param next
 * @param next()
 */
@Injectable()
export class ReceiveMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    const apiToken = this.configService.get('api_token');
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.sendStatus(401);
    }

    const token = bearerToken.substring(7, bearerToken.length);
    console.log(apiToken);
    console.log(token);

    if (apiToken !== token) {
      return res.sendStatus(401);
    }
    next();
  }
}

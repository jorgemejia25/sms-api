import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ReceiveMiddleware } from './middlewares/receive.middleware';
import { ReceiveModule } from './receive/receive.module';
import { SmsModule } from './sms/sms.module';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';

@Module({
  imports: [
    SmsModule,
    ReceiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReceiveMiddleware).forRoutes('receive');
  }
}

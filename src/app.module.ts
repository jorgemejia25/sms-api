import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ReceiveMiddleware } from './middlewares/receive.middleware';
import { ReceiveModule } from './receive/receive.module';
import { SmsModule } from './sms/sms.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { InfoModule } from './info/info.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    SmsModule,
    ReceiveModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReceiveMiddleware).forRoutes('receive');
  }
}

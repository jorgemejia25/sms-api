import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [InfoService],
  controllers: [InfoController],
  exports: [InfoService],
})
export class InfoModule {}

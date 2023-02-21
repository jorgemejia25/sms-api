import { Controller, Get, Param } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  getInfo() {
    return this.infoService.getInfo();
  }

  @Get(':port')
  getJSONPort(@Param('port') port: number) {
    return this.infoService.getJSONPort(port);
  }
}

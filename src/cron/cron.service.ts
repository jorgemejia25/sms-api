import { CronJob } from 'cron';
import { InfoService } from 'src/info/info.service';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
    private readonly infoService: InfoService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.infoService.getInfo();

    this.addCronJobs();
  }

  addCronJobs() {
    const { info } = this.infoService;

    info.forEach((info) => {
      const newJob = new CronJob({
        cronTime: `0 0 0 1/${info.tiempo} * *`,
        // cronTime: `* * * ${info.tiempo} * *`,
        onTick: () => {
          this.infoService.resetRestantes();

          console.log('reset');
        },
      });

      this.schedulerRegistry.addCronJob(`cron-${info.puerto}`, newJob);

      newJob.start();
    });
  }

  getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }
}

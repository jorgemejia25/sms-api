import * as csv from 'csv';
import * as fs from 'fs';
import * as path from 'path';

import { Info } from './../interfaces/Info';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InfoService {
  info: Info[] = [];

  lastRoundRobinPortASC = 0;
  lastRoundRobinPortDESC = 0;

  constructor() {
    this.getInfo();
  }

  getJSONPort(port: number) {
    // Read the csv file
    return this.info.find((info) => info.puerto === port);
  }

  getInfo() {
    const data = fs.readFileSync(
      path.join(__dirname, '../../info.json'),
      'utf8',
    );

    this.info = JSON.parse(data).data;

    return this.info;
  }

  decrementRestantes(port: number) {
    const index = this.info.findIndex((info) => info.puerto === port);
    this.info[index].restantes -= 1;
    this.saveInfo();
  }

  saveInfo() {
    const data = JSON.stringify({ data: this.info });
    fs.writeFileSync(path.join(__dirname, '../../info.json'), data);
  }

  resetRestantes() {
    this.info.forEach((info) => {
      info.restantes = info.mensajes;
    });
    this.saveInfo();
  }

  roundRobinPortASC() {
    const port = this.info[this.lastRoundRobinPortASC].puerto;

    this.lastRoundRobinPortASC =
      this.lastRoundRobinPortASC + 1 === this.info.length
        ? 0
        : this.lastRoundRobinPortASC + 1;

    return port;
  }

  roundRobinPortDESC() {
    const port = this.info[this.lastRoundRobinPortDESC].puerto;

    this.lastRoundRobinPortDESC =
      this.lastRoundRobinPortDESC - 1 === -1
        ? this.info.length - 1
        : this.lastRoundRobinPortDESC - 1;

    return port;
  }
}

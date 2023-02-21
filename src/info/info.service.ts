import * as csv from 'csv';
import * as fs from 'fs';
import * as path from 'path';

import { Info } from './../interfaces/Info';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InfoService {
  info: Info[] = [];

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
    const info = this.info.find((info) => info.puerto === port);
    info.restantes--;
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
}

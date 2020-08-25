import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';

import models from '../models'
import { Utils } from '../utils';

export function initORM() {
  return new Promise((resolve, reject) => {
    createConnection({
      type: 'postgres',
      url: Utils.getConfig('database.postgresql_connection'),
      entities: models,
      synchronize: false,
      logging: false
    } as ConnectionOptions).then(connection => {
      return resolve(connection)
    }).catch(error => reject(error));
  })
}
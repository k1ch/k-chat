import { S3Repository } from '../lib/s3'
import { Utils } from '../utils'
import { getConnection } from 'typeorm'


export class HealthCheckService {
  constructor() { }

  public async getReport() {
    const s3Report = await this.checkS3()
    const dbConnection = await this.checkDbConnection()

    return {
      S3: s3Report, 
      dbConnection
    }
  }

  private async checkS3() {
    const report = {
      state: 'Healthy!'
    }
    try {
      const randomKey = Utils.generateRandomString(20) + '-test'
      const s3Repository = new S3Repository()
      await s3Repository.upload(randomKey, Buffer.from('This is a test', 'utf8'), 'text/plain')
      await s3Repository.delete(randomKey)
    } catch (err) {
      report.state = 'Not healthy!'
      report['reason'] = err
    }
    return report
  }

  private async checkDbConnection() {
    const report = {
      state: 'Healthy!'
    }
    try {
      if (!getConnection().isConnected) throw 'Connection is not connected!'
    } catch (err) {
      report.state = 'Not healthy!'
      report['reason'] = err
    }
    return report
  }
}
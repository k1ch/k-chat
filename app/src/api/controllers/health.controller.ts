import { Router } from 'express'
import { Segments, Joi, celebrate } from 'celebrate'
import { HealthCheckService } from '../../services/health.service';

const packageJson = require('../../../package.json');

export class HealthCheckController {
  private healthCheckRouter: Router
  private healthCheckService: HealthCheckService

  constructor() {
    this.healthCheckRouter = Router()
    this.healthCheckService = new HealthCheckService()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.check()
  }

  get router() {
    return this.healthCheckRouter
  }

  /**
   * Checks if server is running. Also can provide a report from different services if req.query.report === 'true'
   */
  private check() {
    this.healthCheckRouter.get('/', celebrate({
      [Segments.QUERY]: {
        report: Joi.string()
      }
    }), async (req, res, next) => {
      try {
        const response = {
          version: packageJson.version, 
          message: 'Server is running!'
        }
        if (req.query.report === 'true') {
          response['report'] = await this.healthCheckService.getReport()
        } 
        res.status(200).send(response)
      } catch (err) {
        next(err)
      }
    });
  }
}


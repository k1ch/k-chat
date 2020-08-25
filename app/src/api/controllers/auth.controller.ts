import { Router } from 'express'
import { Segments, Joi, celebrate } from 'celebrate'

import { AuthService } from '../../services/auth.service';

export class AuthController {
  private authRouter: Router
  private authService: AuthService

  constructor() {
    this.authRouter = Router()
    this.authService = new AuthService()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.login()
  }

  get router() {
    return this.authRouter
  }

  private login() {
    this.authRouter.post('/login', celebrate({
      [Segments.BODY]: {
        username: Joi.string().required(),
        password: Joi.string().required()
      }
    }), async (req, res, next) => {
      try {
        const response = await this.authService.login(req.body.username, req.body.password)
        res.status(200).send(response)
      } catch (err) {
        next(err)
      }
    })
  }
}
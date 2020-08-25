import { Router } from 'express'
import { Segments, Joi, celebrate } from 'celebrate'

import { UserService } from '../../services/user.service'

export class UserController {
  private usersRouter: Router
  private usersService: UserService

  constructor() {
    this.usersRouter = Router()
    this.usersService = new UserService()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.createUser()
  }

  get router() {
    return this.usersRouter
  }

  private createUser() {
    this.usersRouter.post('/', celebrate({
      [Segments.BODY]: {
        username: Joi.string().required().regex(/^.{4,}$/), // Minimum 4 character
        password: Joi.string().required().regex(/^.{6,}$/) // Minimum 6 character
      }
    }), async (req, res, next) => {
      try {
        const newUser = await this.usersService.createUser(req.body.username, req.body.password)
        res.status(201).send({ id: newUser.id })
      } catch (err) {
        next(err)
      }
    })
  }
}
import { Router } from 'express'
import { HealthCheckController } from './controllers/health.controller';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { MessageController } from './controllers/message.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

export function getRoutes() {
  const appRouter = Router();
  appRouter.use('/', new AuthController().router)
  appRouter.use('/check', new HealthCheckController().router)
  appRouter.use('/users', new UserController().router)
  appRouter.use('/messages', AuthMiddleware.isLoggedIn, new MessageController().router)
  return appRouter
}
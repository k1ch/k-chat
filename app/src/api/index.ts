import { Router } from 'express'
import { ProfileRoutes } from './routes/profiles.routes'
import { ChatRoutes } from './routes/chats/chats.routes'

 export function getRouter() {
  const router = Router()
  new ProfileRoutes(router)
  new ChatRoutes(router)
  return router
}
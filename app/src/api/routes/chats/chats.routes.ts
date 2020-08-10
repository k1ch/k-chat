
import { Router } from 'express-ws'

export class ChatRoutes {
  private chatsRouter: Router

  /**
   * Sets up profiles route 
   * @param {Router} router - The app router
   */
  constructor(router: Router) {
    this.chatsRouter = router
    router.use('/chats', this.chatsRouter)
    this.setupRoutes()
  }

  private setupRoutes() {
  }
}


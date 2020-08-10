import { Router } from 'express'



export class ProfileRoutes {
  private profileRouter: Router

  /**
   * Sets up profiles route 
   * @param {Router} router - The app router
   */
  constructor(router: Router) {
    this.profileRouter = Router()
    router.use('/profiles', this.profileRouter)
    this.setupRoutes()
  }

  private setupRoutes() {
    this.getAll()
  }

  private getAll() {
    this.profileRouter.get('/', async (req, res) => {
      const testPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Should return profile!')
        }, 1000);
      });
      const response = await testPromise
      res.status(200).send({
        "message": response
      })
    });
  }
}


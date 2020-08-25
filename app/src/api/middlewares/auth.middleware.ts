import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../../services/auth.service'

export class AuthMiddleware {
  public static isLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization as string
      if (!authorizationHeader || !authorizationHeader.split(' ')[1]) throw { code: 'AUTH02' }
      const accessToken = authorizationHeader.split(' ')[1]
      const decodedToken = new AuthService().isTokenValid(accessToken)
      req['user_id'] = decodedToken['sub']
      next();
    } catch (err) {
      next(err)
    }
  }
}

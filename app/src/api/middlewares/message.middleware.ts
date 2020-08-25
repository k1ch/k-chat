import { Request, Response, NextFunction } from 'express'
import { SenderOrRecipient } from '../../models/message.model'
import { Segments } from 'celebrate'

export class MessageMiddleware {
  /**
   * Checks whether the user id provided in the body matches with the user_id fetched from
   * accessToken and stored in req.user_id
   * @param userType Can be either 'sender' or 'recipient'
   */
  public static isUserAuthenticInRequest(segment: Segments, userType: SenderOrRecipient) {
    return (req: Request, res: Response, next: NextFunction) => {
      return req[segment][userType].toString() === req['user_id'] ? next() : next({
        code: 'MSG02'
      })
    }
  }
}



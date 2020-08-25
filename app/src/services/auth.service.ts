import jwt from 'jsonwebtoken'

import { UserService } from './user.service'
import { Utils } from '../utils';

export class AuthService {
  private userService: UserService
  constructor() {
    this.userService = new UserService()
  }

  /**
   * Check for login. If successful, returns access token
   * @param username 
   * @param password 
   * @returns user id and accessToken in an object
   */
  public async login(username: string, password: string): Promise<{
    id: number,
    token: string
  }> {
    try {
      const user = await this.userService.getByUsername(username);
      if (user.password_hash !== Utils.deriveKeyFromPassword(password, user.salt, user.salt.length)) {
        throw {
          code: 'AUTH04'
        }
      }
      const accessToken = this.generateAccessToken(user.id, {})
      return {
        id: user.id,
        token: accessToken
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }


  /**
   * Generates an access token which is valid for 2 hours, and can be used to call this server
   * @param {Object} payload - the payload of access token
   * @returns accessToken
   */
  public generateAccessToken(subject: number, payload: Object): string {
    try {
      const token = jwt.sign(payload, Buffer.from(Utils.getConfig('settings.client_secret')),
        {
          subject: subject.toString(),
          expiresIn: Utils.getConfig('settings.access_token_validity'),
          issuer: Utils.getConfig('settings.client_id'),
          audience: [Utils.getConfig('settings.address')]
        })
      return token
    } catch (err) {
      throw {
        code: 'AUTH05',
        stack: err
      }
    }
  }

  public isTokenValid(token): object {
    try {
      const decodedToken = jwt.verify(token, Buffer.from(Utils.getConfig('settings.client_secret')),
        {
          issuer: Utils.getConfig('settings.client_id'),
          audience: [Utils.getConfig('settings.address')]
        });
      return decodedToken as object
    } catch (err) {
      throw {
        code: 'AUTH03',
        stack: err
      }
    }
  }
}
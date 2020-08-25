import { getRepository, Repository, QueryFailedError } from 'typeorm'

import { User } from '../models/user.model';
import { Utils } from '../utils';

export class UserService {
  private userRepository: Repository<User>

  constructor() {
    this.userRepository = getRepository(User)
  }

  public async createUser(username: string, password: string): Promise<User> {
    try {
      const salt = Utils.generateRandomString(parseInt(Utils.getConfig('settings.salt_length')))
      const derivedKey = Utils.deriveKeyFromPassword(password, salt, salt.length)
      // Keep username in lower case (sqlite3 does not support CITEXT)
      username = username.toLowerCase()
      const user = await this.userRepository.create({
        username,
        password_hash: derivedKey,
        salt
      })
      const userSaved = await this.userRepository.save(user)
      return userSaved
    } catch (err) {
      throw {
        code: (err instanceof QueryFailedError) && /unique/gi.test(err.message) ? 'USER02' : 'USER01', // checks if error happened because user already exist
        stack: err
      }
    }
  }

  public async getByUsername(username): Promise<User> {
    try {
      const user = await this.userRepository.createQueryBuilder('user').where('user.username = :username', { username: username.toLowerCase() }).getOne()
      if (!user) throw {
        code: 'USER03',
      }
      return user as User
    } catch (err) {
      if (!err.code || !err.code.startsWith('USER')) throw {
        code: 'USER04',
        stack: err
      }
      else return Promise.reject(err)
    }
  }
}
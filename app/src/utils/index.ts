import { serializeError } from 'serialize-error'
import Crypto from 'crypto';
import config from 'config'

export class Utils {
  static serializeError(err: any) {
    return serializeError(err)
  }

  static getConfig(selector: string) {
    if (!config.has(selector) && !config.get(selector)) throw `Requested Config (${selector}) dose not exist!`
    return config.get(selector)
  }

  /**
   * Derive a key from the password
   * @param {string} password - password to derive key from
   * @param {string} salt - a random string 
   * @param {string} keylen - Specifies the length of pasword - in this app we usally use salt.length
   */
  static deriveKeyFromPassword(password, salt, keylen) {
    return Crypto.scryptSync(password, salt, keylen).toString('hex');
  }

  static generateRandomString(lenght: number) {
    return Crypto.randomBytes(lenght).toString('hex').slice(0, lenght)
  }
}

import {serializeError} from 'serialize-error'
import config from 'config'

export class Utils {
  static serializeError(err: any) {
    return serializeError(err)
  }

  static getConfig(selector: string) {
    if (!config.has(selector) && !config.get(selector)) throw `Requested Config (${selector}) dose not exist!`
    return config.get(selector)
  }
}

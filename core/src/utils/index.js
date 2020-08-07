const serializeError = require('serialize-error')
const config = require('config')


class Utils {
  static serializeError(err) {
    return serializeError(err)
  }

  static getConfig(selector) {
    if (!config.has(selector)) throw "Requested Config dose not exist!"
    return config.get(selector)
  }
}

module.exports = Utils
const serializeError = require('serialize-error')

class Utils {
  static serializeError(err) {
    return serializeError(err)
  }
}

module.exports = Utils
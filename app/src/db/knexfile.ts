const Utils = require('../utils')
module.exports = {
  client: 'pg',
  connection: Utils.getConfig('database.postgresql_connection'),
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  },
  multipleStatements: true
};
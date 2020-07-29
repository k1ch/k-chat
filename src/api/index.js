const { Router } = require('express')
const { ProfileRoutes } = require('./routes/profiles.route')

module.exports.getRouter = () => {
  const router = Router()
  ProfileRoutes(router)

  return router
}
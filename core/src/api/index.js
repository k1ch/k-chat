const { Router } = require('express')
const { ProfileRoutes } = require('./routes/profiles.routes')

module.exports.getRouter = () => {
  const router = Router()
  ProfileRoutes(router)

  return router
}
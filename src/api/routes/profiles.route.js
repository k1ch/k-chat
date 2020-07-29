const { Router } = require('express')
const route = Router()

/**
 * Sets up profiles route 
 * @param {Router} router - The app router
 */
module.exports.ProfileRoutes = (router) => {
  router.use('/profiles', route)

  route.get('/', async (req, res) => {
    const testPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('test endpoint is working!!!')
      }, 1000);
    });
    const response = await testPromise
    res.status(200).send({
      "message": response
    })
  });
}
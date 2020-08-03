const express = require('express')
const app = express();
require('express-ws')(app)
const color = require('colors/safe')
const compression = require('compression');
const bodyParser = require('body-parser');

const { Utils } = require('../utils');
const { getRouter } = require('../api');


/**
 * Setups a express app and 
 * @retun Express app instance
 */
function setupExpress() {
  app.use(bodyParser.json({
    limit: '100kb'
  }));
  app.use(compression())
  app.use(getRouter())


  /**
   * Catch undefined endpoints
   */
  app.use('*', (req, res) => {
    res.status(404).send({
      message: 'Route is not defined!'
    })
  })

  /**
   * Catch unexpecte errors
   */
  app.use((err, req, res, next) => {
    res.status(500).send(`Unexpected error: ${Utils.serializeError(err)}`)
  });
  return app;
}

/**
 * App starts to listen on given port
 * @param {String} - Port number that app will listen to
 * @return undefined 
 */
function startExpressApp(port) {
  app.listen(port, (err) => {
    if (err) {
      /**
       * @todo call logger and log the error
       */
    }
    console.log(color.green(`
    #########################################
    App is listening on port: ${port}  
    #########################################`))
  })
}


module.exports = {setupExpress, startExpressApp}
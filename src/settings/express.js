const express = require('express')
const color = require('colors/safe')
const compression = require('compression');
const bodyParser = require('body-parser');
const { Utils } = require('../utils');
const { getRouter } = require('../api');

module.exports.express = () => {
  const appPort = 3000
  const app = express()
  app.use(bodyParser.json({
    limit: '100kb'
  }));
  app.use(compression())
  app.use(getRouter())

  app.use('*', (req, res) => {
    res.status(404).send({
      message: 'Route is not defined!'
    })
  })

  app.use((err, req, res, next) => {
    res.status(500).send(`Unexpected error: ${Utils.serializeError(err)}`)
  });

  app.listen(appPort, (err) => {
    if (err) {
      /**
       * @todo call logger and log the error
       */
    }
    console.log(color.green(`
    #########################################
        App is listening on port: ${appPort}  
    #########################################`))
  })

  return app;
}
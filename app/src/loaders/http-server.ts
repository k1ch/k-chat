import Express from 'express';
import Http from 'http'
import compression from 'compression'
import bodyParser from 'body-parser'
import { green as greenColor } from 'colors/safe'
import cors from 'cors'
import { errors } from 'celebrate'
import morgan from 'morgan'

import logger from './logger'
import { getRoutes } from '../api'
import { handleError } from '../lib/errors';


/** 
 * Creates a HTTP server using express. 
 * why not just express? HttpServer can be used to setup a websocket on the same port. Also can easily enable HTTPS
*/
export class KchatApp {
  private expressApp: Express.Application
  private _httpServer: Http.Server

  constructor() {
    this.expressApp = Express();
    this._httpServer = Http.createServer(this.expressApp)
    this.setupExpress()
  }

  /**
   * Http server starts listening to the given port
   * @param {String} - Port number that app will listen to
   * @return void 
   */
  public startListening(port): void {
    this._httpServer.listen(port, undefined, undefined, () => {
      console.log(greenColor(`
      #########################################
          App is listening on port: ${port}  
      #########################################`))
    })
  }

  get httpServer() {
    return this._httpServer
  }

  private setupExpress() {
    this.expressApp.use(bodyParser.json({
      limit: '100kb'
    }));
    this.expressApp.use(compression())
    this.expressApp.use(cors())
    this.expressApp.use(morgan('combined', { stream: logger.stream }))
    this.expressApp.use('/', getRoutes())


    /**
     * Catch errors generated with celebrate
     */
    this.expressApp.use(errors())

    /**
     * Catch undefined endpoints
     */
    this.expressApp.use('*', (req, res) => {
      res.status(404).send({
        message: 'Route is not defined!'
      })
    })

    /**
     * Catch errors
     */
    this.expressApp.use((err, req, res, next) => {
      handleError(res, err)
    });
  }
}
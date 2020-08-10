import Express from 'express';
import Http from 'http'
import compression from 'compression'
import bodyParser from 'body-parser'
import { green as greenColor } from 'colors/safe'

import { getRouter } from '../api'
import { Utils } from '../utils';


export class KChatHttpServer {
  private _expressApp: Express.Application
  private _httpServer: Http.Server
  constructor() {
    this._expressApp = Express();
    this._httpServer = Http.createServer(this._expressApp)
    this.setupExpress()
  }
  /**
   * App starts to listen on given port
   * @param {String} - Port number that app will listen to
   * @return undefined 
   */
  public static startListening(httpServer: Http.Server, port) {
    httpServer.listen(port, undefined, undefined, () => {
      console.log(greenColor(`
      #########################################
          App is listening on port: ${port}  
      #########################################`))
    })
  }

  get httpServer() {
    return this._httpServer
  }

  /**
   * Setups the express app and 
   * @retun Express app instance
   */
  private setupExpress() {
    this._expressApp.use(bodyParser.json({
      limit: '100kb'
    }));
    this._expressApp.use(compression())
    this._expressApp.use('/', getRouter())


    /**
     * Catch undefined endpoints
     */
    this._expressApp.use('*', (req, res) => {
      res.status(404).send({
        message: 'Route is not defined!'
      })
    })

    /**
     * Catch unexpecte errors
     */
    this._expressApp.use((err, req, res, next) => {
      res.status(500).send(`Unexpected error: ${Utils.serializeError(err)}`)
    });
  }
}

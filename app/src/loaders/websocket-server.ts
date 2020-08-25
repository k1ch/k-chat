import WebSocket from 'ws'
import Http from 'http'
import { serializeError } from 'serialize-error'

export class KChatWebSocketServer {
  private _wss: WebSocket.Server
  constructor(httpServer: Http.Server) {
    this._wss = new WebSocket.Server({
      server: httpServer, 
      path: '/chats'
    })
    this.init()
  }

  private init() {
    this._wss.on('error', (error) => {
      console.log('Websocket Error: ', serializeError(error))
    })
    this._wss.on('connection', (ws: WebSocket, req: Http.IncomingMessage) => {
      ws.on('message', (message)=> {
        console.log('Incoming message:', typeof message,   message)
      })
      ws.send(JSON.stringify({
        message: 'connection is made', 
        request: Object.keys(req)
      }))
    })
  }

  get wss() {
    return this._wss
  }

}
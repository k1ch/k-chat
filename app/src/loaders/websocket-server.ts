import WebSocket from 'ws'
import Http from 'http'
import { Validator } from 'jsonschema'

import Logger from './logger'
import { AuthService } from '../services/auth.service'
import { Message } from '../models/message.model'
import { MessageBroker, IExchange } from './message-broker'
import { Utils } from '../utils'

export const KchatWSS = {
  init: (httpServer) => {
    const wss = new WebSocket.Server({
      server: httpServer,
      path: '/'
    })

    /**
     * Handels websocket server error
     */
    wss.on('error', (err) => {
      const error = {
        code: 'WSS_01',
        message: 'Error on web socket server!',
        stack: err
      }
      Logger.error(error)
      throw error
    })

    wss.on('connection', (ws: WebSocket, req: Http.IncomingMessage) => {
      ws.isAlive = true;
      ws.callbackFunctions = {}
      ws.on('message', wsEventHandlers.parseMessageToEvent)
        .on(IEventType.AUTHENTICATE, wsEventHandlers.authenticate)
        .on(IEventType.GET_MESSAGES, wsEventHandlers.getNewMessages)
        .on(IEventType.ERROR, wsEventHandlers.handleError)
        .on(IEventType.SEND_RESPONSE, wsEventHandlers.handleReponse)
        .on(IEventType.DISCONNECT, wsEventHandlers.disconnect)
    })
  }
}


/**
 * Functions are bound to WebSocket object and "this" represents "ws"
 * If arrow function is defind it is not bound no longer
 */
const wsEventHandlers = {
  /**
   * Parses a massage and check if it is a valid event then emit that event. 
   * @param message 
   */
  parseMessageToEvent: function (message) {
    try {
      var event = JSON.parse(message) as IEvent;
      new Validator().validate(event, eventSchema, { throwError: true });
      this.emit(event.type, event.payload);
    } catch (err) {
      this.emit(IEventType.ERROR, {
        code: 'WSS_02',
        message: 'Failed to parse your request!',
        stack: err
      })
    }
  },

  handleError: function (err) {
    Logger.error(err)
    this.send(JSON.stringify(Utils.serializeError(err)))
  },

  handleReponse: function (response: Object) {
    this.send(JSON.stringify(response))
  },

  authenticate: function (payload) {
    try {
      const authService = new AuthService()
      const token = authService.isTokenValid(payload.token)
      this.accessTokenObject = token
      this.userId = token['sub']
      this.emit(IEventType.SEND_RESPONSE, {
        message: 'Authenticated!',
        userId: this.userId
      })
    } catch (err) {
      this.emit(IEventType.ERROR, {
        code: 'WSS_03',
        message: 'Failed to authenticate!',
        stack: err
      })
    }
  },

  getNewMessages: function () {
    try {
      if (!this.userId) throw 'You need to be authenticated!'

      // Avoids duplication if this event is handled before for this websocket
      if (!this.callbackFunctions[IEventType.GET_MESSAGES]) {
        const cb = function (message: Message) {
          if (this && this.isAlive && this.userId &&
            message && message.recipient.toString() === this.userId) {
            this.emit(IEventType.SEND_RESPONSE, { event: IEventType.GET_MESSAGES, payload: { recipient: this.userId, message: message } })
          }
        }
        this.callbackFunctions[IEventType.GET_MESSAGES] = MessageBroker.consume(IExchange.MESSAGES, cb.bind(this))
        this.emit(IEventType.SEND_RESPONSE, 'Start listening for user: ' + this.userId)
      }
    } catch (err) {
      this.emit(IEventType.ERROR, {
        code: 'WSS_04',
        message: 'Error to get new messages!',
        stack: err
      })
    }
  },

  disconnect: function () {
    this.isAlive = false;
    this.terminate()
    for (const cb in this.callbackFunctions) MessageBroker.stopConsume(this.callbackFunctions[cb])
  }
}

interface IEvent {
  type: IEventType;
  payload: object;
}

enum IEventType {
  ERROR = 'error',
  AUTHENTICATE = 'authenticate',
  GET_MESSAGES = 'getMessages',
  SEND_RESPONSE = 'sendResposne',
  DISCONNECT = 'disconnect'
}

const eventSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string',
      'enum': [IEventType.DISCONNECT, IEventType.GET_MESSAGES, IEventType.AUTHENTICATE]
    },
    'payload': {
      'type': 'object'
    }
  },
  'required': ['type'],
  'additionalProperties': false
}

import WebSocket from 'ws'
import Http from 'http'
import { serializeError } from 'serialize-error'
import { Validator } from 'jsonschema'

import Logger from './logger'
import { AuthService } from '../services/auth.service'

export function initKchatWSS(httpServer) {
  const wss = new WebSocket.Server({
    server: httpServer,
    path: '/'
  })
  wss.on('error', (error) => {
    Logger.error(serializeError(error))
  })
  wss.on('connection', (ws: WebSocket, req: Http.IncomingMessage) => {
    ws.on('message', wsEventHandlers.parseMessageToEvent)
      .on(EventType.AUTHENTICATE, wsEventHandlers.authenticate)
      .on(EventType.GET_MESSAGES, wsEventHandlers.getNewMessages)
      .on(EventType.ERROR, wsEventHandlers.handleError)
      .on(EventType.SEND_RESPONSE, wsEventHandlers.handleReponse)
  })
}

const wsEventHandlers = {
  parseMessageToEvent: function (message) {
    try {
      var event = JSON.parse(message) as IEvent;
      new Validator().validate(event, eventSchema, { throwError: true });
      this.emit(event.type, event.payload);
    } catch (err) {
      this.emit(EventType.ERROR, {
        message: 'Failed to parse you request!',
        error: err
      })
    }
  },
  handleError: function (err) {
    Logger.error(serializeError(err))
    this.send(JSON.stringify(serializeError(err)))
  },
  handleReponse: function (response) {
    this.send(JSON.stringify(serializeError(response)))
  },
  authenticate: function (payload) {
    try {
      const authService = new AuthService()
      const token = authService.isTokenValid(payload.token)
      this.accessTokenObject = token
      this.userId = token['sub']
      this.emit(EventType.SEND_RESPONSE, {
        message: 'Authenticated!',
        userId: this.userId
      })
    } catch (err) {
      this.emit(EventType.ERROR, {
        message: 'Failed to authenticate!',
        error: err
      })
    }
  },
  getNewMessages: function () {
    try {
      this.emit(EventType.SEND_RESPONSE, { message: this.userId ? `You are authenticated ${this.userId}` : { error: 'you are not authenticated!' } })
    } catch (err) {
      this.emit(EventType.ERROR, {
        message: 'Error to get new messages!',
        error: err
      })
    }
  }
}

interface IEvent {
  type: EventType;
  payload: object;
}

enum EventType {
  ERROR = 'error',
  AUTHENTICATE = 'authenticate',
  GET_MESSAGES = 'getMessages',
  SEND_RESPONSE = 'sendResposne'
}

const eventSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string',
      'enum': ['authenticate', 'getMessages']
    },
    'payload': {
      'type': 'object'
    }
  },
  'required': ['type'],
  'additionalProperties': false
}

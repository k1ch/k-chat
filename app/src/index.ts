import { KchatApp } from './loaders/http-server'
import { initORM } from './loaders/typeorm'
import { Utils } from './utils'
import { KChatWebSocketServer } from './loaders/websocket-server';


async function initServer() {
  await initORM()
  const kchatApp = new KchatApp()
  const wss = new KChatWebSocketServer(kchatApp.httpServer).wss
  kchatApp.startListening(Utils.getConfig('settings.app_port'))
}

initServer()
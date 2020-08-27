import { KchatApp } from './loaders/http-server'
import { initORM } from './loaders/typeorm'
import { Utils } from './utils'
import { initKchatWSS } from './loaders/websocket-server';


async function initServer() {
  await initORM()
  const kchatApp = new KchatApp()
  initKchatWSS(kchatApp.httpServer)
  kchatApp.startListening(Utils.getConfig('settings.app_port'))
}

initServer()
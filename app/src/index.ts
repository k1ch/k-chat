import { KchatApp } from './loaders/http-server'
import { initORM } from './loaders/typeorm'
import { Utils } from './utils'
import { KchatWSS } from './loaders/websocket-server';
import { MessageBroker } from './loaders/message-broker';
import Logger from './loaders/logger';


async function initServer() {
  try {
    await initORM()
    await MessageBroker.init()
    const kchatApp = new KchatApp()
    KchatWSS.init(kchatApp.httpServer)
    kchatApp.startListening(Utils.getConfig('settings.app_port'))
  } catch (err) {
    Logger.error({
      code: "Failed to run the app!",
      stack: err
    })
    process.exit(1)
  }
}

initServer()
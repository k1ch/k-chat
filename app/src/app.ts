import { KChatHttpServer } from './settings/http-server'
import { Utils } from './utils';
import { KChatWebSocketServer } from './settings/websocket-server';

/**
 * This is the server entry point
 * Initialize the app
 */
function initServer() {
    const httpServer = new KChatHttpServer().httpServer
    const wss = new KChatWebSocketServer(httpServer).wss
    KChatHttpServer.startListening(httpServer, Utils.getConfig('settings.app_port'))
}

initServer()
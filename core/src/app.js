'use strict';
const config = require('config')

const { setupExpress, startExpressApp } = require('./settings/express');

/**
 * This is the server entry point
 * Initialize the server
 */
function initServer() {
    if (!config.has('settings.app_port')) throw 'App Port is not defined'
    setupExpress()
    startExpressApp(config.get('settings.app_port'))
}

initServer()
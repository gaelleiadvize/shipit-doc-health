'use strict';

require('./bootstrap');

const config = require('./config');

const uuid = require ('uuid');
const errors = require('./errors')(console);
const sessionManager = require('./managers/session')(uuid, errors);
const socketManager = require('./managers/socket')(config.socket, errors, console, sessionManager);
const resources = require('./resources')(config.resources, errors, console);
const domain = require('./domain')(errors, resources);
const botManager = require('./botManager');

// Launchers
const launchServer = require('./server');
const launchBot = _.partial(botManager, config.botManagers, errors, domain, console, sessionManager);

socketManager.create()
  .then(launchBot)
  .then(launchServer);

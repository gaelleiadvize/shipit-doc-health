'use strict';

require('./bootstrap');

const config = require('./config');

const logger = console;
const errors = require('./errors')(logger);
const socketsPool = require('./managers/socketsPool')(errors);
const resources = require('./resources')(config.resources, errors, logger);
const redis = require('./helpers/redisClient')(config.redis, logger);

return redis.connect()
  .then((redisClient) => {
    const repos = require('./repos')(redisClient);
    const socketManager = require('./managers/socket')(config.socket, errors, logger, socketsPool);
    const domain = require('./domain')(config, logger, errors, repos, resources);
    const api = require('./api')(config, errors, logger, domain, repos);
    const botManager = require('./botManager');

    // Launchers
    const launchServer = require('./server')(config.app, api);
    const launchBot = _.partial(botManager, config.botManagers, errors, domain, console, repos.session);

    return socketManager.create()
    .then(launchBot)
    .then(launchServer);
  });

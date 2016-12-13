'use strict';

module.exports = (config, errors, domain, logger, sessionManager, socket) => {
  
  switch(config.activedBotManager) {
    case 'wit':
      require('./wit')(config.wit, errors, domain, logger, sessionManager, socket);
      break;
    default:
      throw new errors.UnknownBotManagerPluginError('bot/index', 'Unknown bot manager plugin ' + config.activedBotManager);
  }
};

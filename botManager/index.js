'use strict';

module.exports = (config, errors, domain, logger, session, socket) => {
  switch(config.activedBotManager) {
    case 'wit':
      require('./wit')(config.wit, errors, domain, logger, session, socket);
      break;
    case 'motion':
      require('./motion')(config.motion, errors, domain, logger, socket);
      break;
    default:
      throw new errors.UnknownBotManagerPluginError('bot/index', 'Unknown bot manager plugin ' + config.activedBotManager);
  }
};

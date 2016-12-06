'use strict';

module.exports = (config, errors, domain, logger) => {
  
  switch(config.activedBotManager) {
    case 'wit':
      const wit = require('./wit')(config.wit, errors, domain, logger);
      return {
        client: wit.client,
        addReceivedMessageHandler: wit.addReceivedMessageHandler
      };
    default:
      throw new errors.UnknownBotManagerPluginError('bot/index', 'Unknown bot manager plugin ' + botManagerName);
  }
};

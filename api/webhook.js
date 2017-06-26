'use strict';

/**
 * Webhook actions
 */
module.exports = (config, logger, errors, domain, session) => {
  return {
    $post: function (request, reply) {
      return when.try(() => {
        let actions = {};
        switch(config.botManagers.activedBotManager) {
          case 'wit':
            actions = require('../botManager/wit/actions')(logger, domain);
            break;
          case 'motion':
            actions = require('../botManager/motion/actions')(logger, errors, domain, session);
            break;
          default:
            throw new errors.UnknownBotManagerPluginError('webhook', 'Unknown bot manager plugin ' + config.botManagers.activedBotManager);
        }
        const action = _.get(actions, request.params.action);
        if (! _.isFunction(action)) {
          throw new errors.MotionBadRequestError('webhook', 'Unknown action ' + request.params.action);
        }
        return action(request.body)
          .then((result) => {
            reply.json(result).status(201);
          });
      })
      .catch((error) => {
        logger.error(error);

        return reply.json({
          error: {
            title: 'Webhook execution error',
            detail: error.message || error
          }
        }).status(500);
      });
    }
  };
};

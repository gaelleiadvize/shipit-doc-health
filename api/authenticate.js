'use strict';

/**
 * Authentication routes
 *
 * @param {object} authSessionManager Manage all authentication steps
 * @param {object} errors             Errors helper
 *
 * @returns {{$get: Function}}
 */
module.exports = (authSessionManager, logger) => {
  return {
    $get: function (request, reply) {
      authSessionManager.getAuthUrl()
        .then((authUrl) => {
          reply.redirect(authUrl);
        })
        .catch(function(error) {
          logger.error(error);

          return reply.json({
            error: {
              title: 'Session creation error',
              detail: error.message || error
            }
          }).code(500);
        });
    }
  };
};

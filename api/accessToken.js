'use strict';

/**
 * Access token route
 *
 * @param {object} authSessionManager Manage all authentication steps
 * @param {object} errors             Errors helper
 *
 * @returns {{$get: Function}}
 */
module.exports = (authSessionManager, logger) => {
  return {
    $get: (request, reply) => {
      authSessionManager.createAccessToken(request.query.code, request.query.state)
        .then((result) => {
          reply.redirect('/app.html?sessionId=' + result.sessionId);
        })
        .catch((error) => {
          logger.error(error);

          return reply.json({
            error: {
              title: 'Token retrieving error',
              detail: error.message || error
            }
          }).code(500);
        });
    }
  };
};

'use strict';

/**
 * Access token route
 *
 * @param {object} authSessionManager Manage all authentication steps
 * @param {object} logger             Logger
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
          reply.redirect('/authenticate');
        });
    }
  };
};

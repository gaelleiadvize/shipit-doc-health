'use strict';

/**
 * Handlers entry point
 *
 * @param {object} domain - Domain
 * @param {object} logger - Logger
 *
 * @returns {{management: *, authenticate: *, accessToken: *}}
 */
module.exports = (domain, logger) => {
  return {
    authenticate: require('./authenticate')(domain.authSession, logger),
    accessToken: require('./accessToken')(domain.authSession, logger)
  };
};

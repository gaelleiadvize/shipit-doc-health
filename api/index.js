'use strict';

/**
 * Handlers entry point
 *
 * @param {object} domain - Domain
 * @param {object} logger - Logger
 *
 * @returns {{management: *, authenticate: *, accessToken: *}}
 */
module.exports = (config, errors, logger, domain, repos) => {
  return {
    authenticate: require('./authenticate')(domain.authSession, logger),
    accessToken: require('./accessToken')(domain.authSession, logger),
    webhook: require('./webhook')(config, logger, errors, domain, repos.session)
  };
};

'use strict';

module.exports = (config, logger, errors, repos, resources) => {
  const stats = require('./stats')(errors, resources.publicApi, resources.dataMinding);
  const authSession = require('./authSession')(config.credentials.google, logger, repos.session);
  const calendar = require('./calendar')(authSession, resources.googleApi);

  return {
    stats,
    authSession,
    calendar
  };
};

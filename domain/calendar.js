'use strict';

module.exports = (authSessionManager, googleApi) => {
  const listCalendars = (sessionId) => {
    return authSessionManager.getOAuthClient(sessionId)
      .then((credentials) => {
        return googleApi.calendar.list(credentials);
      });
  };

  return {
    listCalendars
  };
};

'use strict';

const moment = require('moment');

module.exports = (authSessionManager, googleApi) => {
  const listCalendars = (sessionId) => {
    return authSessionManager.getOAuthClient(sessionId)
      .then((credentials) => {
        return googleApi.calendar.list(credentials);
      });
  };

  const listResources = (sessionId) => {
    return listCalendars(sessionId)
      .then((data) => {
        return _.filter(data, (object) => {
          return _.endsWith('@resource.calendar.google.com', object.id);
        });
      });
  };

  const getCalendarAvailability = (sessionId, resourceId, from, to) => {
    return authSessionManager.getOAuthClient(sessionId)
      .then((credentials) => {
        return googleApi.calendar.events.list(credentials, {
          query: {
            calendarId: resourceId,
            timeMin: moment(from).format(),
            timeMax: moment(to).format()
          }
        })
        .then((eventsList) => {
          return _.filter(eventsList.items, (item) => (item.status !== 'cancelled'))
        })
        .then((events) => {
          return _.map(events.items, (event) => _.pick(event, ['start', 'end']));
        });
      });
  };

  return {
    listCalendars,
    listResources,
    getCalendarAvailability
  };
};
// Get Resources availability
// Get target calendar

// Check target and resources slots

// Create target and resource event

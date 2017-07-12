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
          calendarId: resourceId,
          timeMin: moment(from).format(),
          timeMax: moment(to).format()
        })
        .then((eventsList) => {
          return when.map(eventsList.items, (event) => {
            return googleApi.calendar.events.instances(credentials, {
              calendarId: resourceId,
              eventId: event.id,
              timeMin: moment(from).format(),
              timeMax: moment(to).format()
            })
            .then((eventInstances) => {
              if (_.isEmpty(eventInstances.items)) {
                return event;
              }
              return eventInstances.items;
            });
          });
        })
        .then(_.flattenDeep)
        .then((eventsList) => {
          return _.filter(eventsList, (item) => (item.status !== 'cancelled'));
        })
        .then((events) => {
          return _.map(events, (event) => {
            return {
              start: _.get(event, 'start.dateTime'),
              end: _.get(event, 'end.dateTime')
            };
          });
        })
        .then(_.partialRight(_.sortBy, ['start']));
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

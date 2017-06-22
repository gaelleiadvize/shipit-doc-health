'use strict';

var google = require('googleapis');

module.exports = () => {

  const sendRequest = (method, api, resourceName, credentials, data) => {
    const sendRequestToApi = _.get(api, resourceName);
    const options = data || {};
    options.auth = credentials;

    return when.promise((resolve, reject) => {
      if (!_.isFunction(sendRequestToApi)) {
        return reject('API sender doesnt exists');
      }

      sendRequestToApi(options, (err, apiResult) => {
        if (err) {
          return reject(err);
        }
        resolve(apiResult);
      });
    });
  };

  const calendar = google.calendar('v3');

  return {
    calendar: {
      list: function(credentials, data) {
        return sendRequest('GET', calendar, 'calendar.calendarList.list', credentials, data);
      }
    }
  };
};

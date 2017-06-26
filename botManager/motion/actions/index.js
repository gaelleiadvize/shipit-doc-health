'use strict';

module.exports = (logger, errors, domain, session) => {
  const calendar = require('./calendar')(logger, errors, domain, session);
  return calendar;
};

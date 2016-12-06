'use strict';

module.exports = (logger, domain) => {
  const stats = require('./stats')(logger, domain.stats);

  return _.merge({}, stats);
};

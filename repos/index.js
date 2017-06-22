'use strict';

module.exports = (redis) => {
  return {
    session: require('./session')(redis)
  };
};

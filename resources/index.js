'use strict';

module.exports = (config, errors, logger) => {
  var httpClient = require('request-promise');
  var mysql = require('mysql');

  return {
    dataMinding: require('./dataMinding')(config.dataMinding, errors, logger, mysql),
    publicApi: require('./publicApi')(config.publicApi, errors, logger, httpClient),
    googleApi: require('./googleApi')()
  };
};

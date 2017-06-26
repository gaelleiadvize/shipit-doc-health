'use strict';

module.exports = function(logger) {
  /**
   * Default error
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function DefaultError(action, message, context) {
    this.name = 'DefaultError';
    this.message = (message || '');
    this.included = context;

    logger.error({
      action: action,
      message: message,
      details: context
    });
  }

  DefaultError.prototype = Object.create(Error.prototype);

  return {
    DefaultError: DefaultError,
    HttpClientError: require('./httpClientError')(DefaultError),
    SocketConnectionError: require('./socketConnectionError')(DefaultError),
    SocketNotFoundError: require('./socketNotFoundError')(DefaultError),
    WitClientError: require('./witClientError')(DefaultError),
    WitBadRequestError: require('./witBadRequestError')(DefaultError),
    SessionNotFoundError: require('./sessionNotFoundError')(DefaultError),
    DataMindingError: require('./dataMindingError')(DefaultError),
    ClientNotFoundError: require('./clientNotFoundError')(DefaultError),
    UnknownBotManagerPluginError: require('./unknownBotManagerPluginError')(DefaultError),
    MotionBadRequestError: require('./MotionBadRequestError')(DefaultError)
  };
};

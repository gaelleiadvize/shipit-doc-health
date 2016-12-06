'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when an external bot manager is not plugged
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function UnknownBotManagerPluginError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'UnknownBotManagerPluginError';
  }

  UnknownBotManagerPluginError.prototype = Object.create(DefaultError.prototype);

  return UnknownBotManagerPluginError;
};

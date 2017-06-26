'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when an motion.ai request fails
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function MotionBadRequestError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'MotionBadRequestError';
  }

  MotionBadRequestError.prototype = Object.create(DefaultError.prototype);

  return MotionBadRequestError;
};

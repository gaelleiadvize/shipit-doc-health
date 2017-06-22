'use strict';

/*eslint camelcase: 0*/

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var crypto = require('crypto');
var google = require('googleapis');

/**
 * Authentication manager
 *
 * @param {object} config          Credentials configuration : {clientId, secret, service callback)
 * @param {object} logger          Logger
 * @param {object} authSessionRepo Redis repository
 *
 * @returns {{createSession: Function, createAccessToken: Function, getOAuthClient: Function}}
 */
module.exports = function (config, logger, authSessionRepo) {
  const oauth2Client = new google.auth.OAuth2(config.clientId, config.secret, config.callback);
  /**
   * Get the OAuth token and store it in Redis
   *
   * @param {string} sessionId  - session Id
   * @param {string} code       - user auth code
   *
   * @returns {promise} with tokens if it resolves
   */
  function getToken(sessionId, code) {
    return when.promise(function(resolve, reject) {
      oauth2Client.getToken(code, function (err, tokens) {
        if (err) {
          return reject(err);
        }

        return authSessionRepo.setCredentials(sessionId, code, tokens)
        .done(function () {
          resolve(tokens);
        }, reject);
      });
    });
  }

  return {
    /**
     * Create a new authentication session
     *
     * @param {int}     userRepoId  userRepo identifier
     * @param {string}  callbackUri userRepo callback url, called when authentication done
     *
     * @returns {Promise} With Google Auth url
     */
    getAuthUrl: function () {
      const sessionId = crypto.createHash('sha1').digest('hex');
      const url = oauth2Client.generateAuthUrl({
        state: sessionId,
        access_type: 'online',
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      return when.resolve(url);
    },
    /**
     * Get and store a new access token
     *
     * @param {string} code      - OAuth code to exchange with a token
     * @param {string} sessionId - Session identifier : Generated security hash state
     *
     * @returns {Promise} With userRepo callback url
     */
    createAccessToken: function (code, sessionId) {
      return getToken(sessionId, code)
        .then(() => {
          return when.resolve({sessionId});
        });
    },
    /**
     * Get the OAuth client instance set with userRepo tokens
     *
     * @param {int} sessionId - User identifier
     *
     * @returns {Promise} With the OAuth client instance
     */
    getOAuthClient: function (sessionId) {
      return authSessionRepo.get(sessionId)
      .then(function (data) {
        if (!data) {
          return when.reject('Not found session ' + sessionId);
        }

        if (data.expiry_date > _.now()) {
          return when.resolve(data);
        }

        return getToken(sessionId, data.code);
      })
      .then(function(tokens) {
        oauth2Client.setCredentials(tokens);
        return when.resolve(oauth2Client);
      });
    }
  };
};

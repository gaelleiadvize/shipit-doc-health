'use strict';

const KEYS_PREFIX = 'session:';

/**
 * AuthSession Repository
 * Stores session data during OAuth2 server authentication procedure
 *
 * Note : Keys has short expire time
 *
 * @param {object} redis Redis client
 *
 * @returns {{set: Function, get: Function}}
 */
module.exports = function (redis) {
  /**
   * Set session data
   *
   * @param {string} sessionId Session identifier : Generated security hash state
   * @param {object} data Data to store
   *
   * @returns {Promise}
   */
  const setData = (sessionId, data) => {
    return when.promise((resolve, reject) => {
      redis.client.hmset(KEYS_PREFIX + sessionId, data, (err) => {
        if (err) {
          return reject(err);
        }

        redis.client.expire(KEYS_PREFIX + sessionId, redis.ttl, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      });
    });
  };

  return {
    setData,
    /**
     * Create a new session
     *
     * @param {string}  sessionId        Session identifier : Generated security hash state
     * @param {int}     code        User identifier
     * @param {array}   tokens      Google api tokens
     *
     * @returns {Promise}
     */
    setCredentials: (sessionId, code, tokens) => {
      return setData(sessionId, _.assign(tokens, {code: code}));
    },
    /**
     * Get a session
     *
     * @param sessionId Session identifier
     *
     * @returns {Promise}
     */
    get: (sessionId) => {
      return when.promise(function (resolve, reject) {
        redis.client.hgetall(KEYS_PREFIX + sessionId, function (err, data) {
          if (err) {
            return reject(err);
          }

          if (!data) {
            return resolve();
          }

          return resolve(data);
        });
      });
    }
  };
};

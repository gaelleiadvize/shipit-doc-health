'use strict';

var Redis = require('redis');

module.exports = (config, logger) => {
  return {
    /**
     * Connects to a Redis database
     *
     * @returns {Object} Redis client
     */
    connect: () => {
      return when.promise((resolve) => {
        const redisClient = Redis.createClient(config.port, config.host);

        redisClient.on('error', ( error ) => {
          logger.error('Redis Error: ' + error);
        });
        redisClient.on('ready', () => {
          logger.info('Redis client ready');
          resolve({
            client: redisClient,
            ttl: config.ttl
          });
        });
      });
    }
  };
};

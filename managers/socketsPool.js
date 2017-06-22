'use strict';

module.exports = (errors) => {
  this.socketsPool = {};

  const getSocket = (sessionId) => {
    return when.promise((resolve, reject) => {
      const socket = this.socketsPool[sessionId];
      if (_.isEmpty(socket)) {
        return reject(new errors.SessionNotFoundError('socketPool/getSocket', 'Unknown session id ' + sessionId));
      }
      return resolve(socket);
    });
  };

  const setSocket = (sessionId, socket) => {
    return when.promise((resolve, reject) => {
      this.socketsPool[sessionId] = socket;
      return resolve(socket);
    });
  };

  return {
    getSocket,
    setSocket
  };
};

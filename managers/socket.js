'use strict';

module.exports = (config, errors, logger, socketPool) => {
  const socketIo = require('socket.io');

  this.receivedMessageHandler = () => {
    logger.error(new errors.SocketConnectionError('socket', 'Missing receivedMessageHandler'));
  };

  var newConnection = (socket) => {
    const sessionId = socket.handshake.query.sessionId;
    return socketPool.setSocket(sessionId, socket)
      .then(() => {
        socket.send({
          type: 'connection.established'
        });
      })
      .then(() => {
        socket.on('message', this.receivedMessageHandler);
        logger.log('New connection ' + sessionId + ' on port ' + config.port)
      });
  };

  var sendMessage = (sessionId, message, quickReplies, cards) => {
    return socketPool.getSocket(sessionId)
    .then((socket) => {
      if (_.isEmpty(socket)) {
        return when.reject(
          new errors.SocketNotFoundError('socket/sendMessage', 'No socket found in session ' + sessionId)
        );
      }
      socket.send({
        sessionId,
        type: 'message',
        message,
        quickReplies,
        cards
      });
    });
  };

  return {
    create: () => {
      socketIo(config.port).on('connection', newConnection);
      logger.log('Socket listening on port ' + config.port);
      return when.resolve({
        sendMessage,
        addReceivedMessageHandler: (handler) => {
          this.receivedMessageHandler = handler;
        }
      });
    }
  };
};

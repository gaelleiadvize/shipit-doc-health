'use strict';

module.exports = (config, errors, domain, logger, socket) => {
  const httpClient = require('request-promise');

  // When the visitor send a message to the bot
  socket.addReceivedMessageHandler((data) => {
    const sessionId = data.sessionId;
    const options = {
      method: 'GET',
      url: config.url,
      json: true,
      qs: {
        msg: data.message,
        bot: config.botId,
        session: sessionId,
        key: config.key
      }
    };
    return httpClient(options)
      .then((res) => {
        if (!_.isEmpty(res.err)) {
          return when.reject(res.err);
        }
        const quickReplies = _.map(res.quickReplies, (reply) => reply.title);
        return socket.sendMessage(
          sessionId,
          res.botResponse,
          quickReplies,
          res.cards
        );
      })
      .catch((err) => {
        return when.reject(new errors.MotionBadRequestError('index', 'Motion.ai have a problem', err));
      });
  });
};

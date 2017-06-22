'use strict';

module.exports = (config, errors, domain, logger, session, socket) => {
  const wit = require('node-wit');
  const actions = require('./actions')(logger, domain);

  // When the bot responds to the visitor
  actions.send = (request, response) => {
    const {text, quickreplies} = response;
    return socket.sendMessage(request.sessionId, text, quickreplies);
  };

  const client = new wit.Wit({accessToken: config.token, actions});

  // When the visitor send a message to the bot
  socket.addReceivedMessageHandler((data) => {
    const sessionId = data.sessionId;
    return session.get(sessionId)
      .then((sessionData) => {
        const rawContext = _.isEmpty(_.get(sessionData, 'context')) ? '{}' : _.get(sessionData, 'context');
        const context = JSON.parse(rawContext);
        return client.runActions(
          sessionId, // the user's current session
          data.message, // the user's message
          context
        )
        .catch((err) => {
          return when.reject(new errors.WitBadRequestError('index', 'Wit have a problem', err.stack || err));
        })
        .then((context) => {
          return session.setData(sessionId, {'context': JSON.stringify(context)});
        });
      });
  });
};

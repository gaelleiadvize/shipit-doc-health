'use strict';

module.exports = (config, errors, domain, logger) => {
  const wit = require('node-wit');
  const actions = require('./actions')(logger, domain);
  const client = new wit.Wit({accessToken: config.token, actions});

  return (sessionManager, socket) => {
    // When the bot responds to the visitor
    actions.send = (request, response) => {
      const {text, quickreplies} = response;
      return socket.sendMessage(request.sessionId, text, quickreplies);
    };
    // When the visitor send a message to the bot
    socket.addReceivedMessageHandler((data) => {
      return sessionManager.getSession(data.sessionId)
      .then((session) => {
        return client.runActions(
          session.id, // the user's current session
          data.message, // the user's message
          session.context || {}
        )
        .catch((err) => {
          return when.reject(new errors.WitBadRequestError('index', 'Wit have a problem', err.stack || err));
        })
        .then((context) => {
          return sessionManager.setSession(session.id, 'context', context);
        });
      });
    });
  };
};

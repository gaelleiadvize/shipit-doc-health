'use strict';

module.exports = (logger, errors, domain, session) => {
  const extractSessionId = (data) => {
    return _.last(data.session.split('_'));
  };
  const extractContext = (data) => {
    const rawContext = _.isEmpty(_.get(data, 'context')) ? '{}' : _.get(data, 'context');
    const context = JSON.parse(rawContext);
    return context;
  };
  const storeContext = (data) => {
    console.log(data)
    const sessionId = extractSessionId(data);
    return session.get(sessionId)
      .tap(() => {
        return domain.calendar.listCalendars(sessionId)
        .then((data) => console.log(data))
      })
      .then((sessionData) => {
        const context = extractContext(sessionData);

        if (_.indexOf(['bot start', 'restart'], data.reply) > -1) {
          return {};
        }
        const reply = _.isEmpty(data.replyData) ? data.reply: data.replyData;
        return _.set(context, 'data.' + data.moduleNickname, reply);
      })
      .catch((err) => {
        return when.reject(new errors.MotionBadRequestError('index', 'Motion.ai have a problem', err));
      })
      .then((context) => {
        console.log(context, sessionId)
        return session.setData(sessionId, {'context': JSON.stringify(context)});
      });
  };
  const getAvailability = (data) => {
    console.log(data);
    const sessionId = extractSessionId(data);
    return session.get(sessionId)
    .then((sessionData) => {
      const context = extractContext(sessionData);
      domain.calendar.listCalendars(sessionId)
      .then((data) => {
        console.log(data)
      });
      return when.resolve({
        slot1: 'a',
        slot2: 'b',
        slot3: 'c'
      });
    })
    .catch((err) => {
      return when.reject(new errors.MotionBadRequestError('index', 'Motion.ai have a problem', err));
    });
  };

  const bookRoom = (data) => {
    console.log(data);
    return when.resolve();
  };

  return {
    storeContext,
    getAvailability,
    bookRoom
  };
};

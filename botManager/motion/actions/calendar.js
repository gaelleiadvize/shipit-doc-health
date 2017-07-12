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
    const sessionId = extractSessionId(data);
    return session.get(sessionId)
      .then((sessionData) => {
        const context = extractContext(sessionData);

        if (_.indexOf(['bot start', 'restart'], data.reply) > -1) {
          return {};
        }
        const reply = _.isEmpty(data.replyData) ? data.reply: data.replyData;
        return _.set(context, 'data.' + data.moduleNickname, reply);
      })
      .catch((err) => {
        return when.reject(new errors.MotionBadRequestError('storeContext', 'Motion.ai have a problem', err));
      })
      .then((context) => {
        return session.setData(sessionId, {'context': JSON.stringify(context)});
      });
  };
  const getAvailability = (data) => {
    const sessionId = extractSessionId(data);
    return session.get(sessionId)
    .then((sessionData) => {
      const context = extractContext(sessionData);
      console.log(context);
      const calendarId = _.split(context.Who, ' ').join('.') + '@iadvize.com';
      return domain.calendar.getCalendarAvailability(sessionId, calendarId, '2017-06-01', '2017-06-30')
      .then((data) => {
        console.log(data);
        return when.resolve({
          slot1: 'a',
          slot2: 'b',
          slot3: 'c'
        });
      });
    })
    .catch((err) => {
      return when.reject(new errors.MotionBadRequestError('getAvailability', 'Motion.ai have a problem', err));
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

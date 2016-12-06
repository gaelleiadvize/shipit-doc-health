'use strict';

module.exports = (logger, statsDomain) => {

  const getEntity = (entities, entity, attribute) => {
    const val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
       (attribute && entities[entity][0][attribute] || entities[entity][0].value)
      ;
    if (!val) {
      return null;
    }
    return typeof val === 'object' ? val.value : val;
  };

  return {
    getContactsPerHour: ({context, entities}) => {
      return when(entities)
        .then((entities) => {
          const params = {
            clientName: getEntity(entities, 'clientName'),
            indicators: getEntity(entities, 'indicators'),
            from: getEntity(entities, 'datetime', 'from'),
            to: getEntity(entities, 'datetime', 'to'),
            channel: getEntity(entities, 'channel'),
            resource: getEntity(entities, 'resource'),
            resource_id: getEntity(entities, 'resource_id'),
            granularity: getEntity(entities, 'granularity')
          };

          if (_.isEmpty(params.clientName)) {
            context.missingClientName = true;
            return when.resolve(context);
          }
          if (_.isEmpty(params.indicators)) {
            context.missingIndicators = true;
            return when.resolve(context);
          }
          if (_.isEmpty(params.from) || _.isEmpty(params.to)) {
            context.missingPeriod = true;
            return when.resolve(context);
          }

          params.from = _.truncate(params.from, {
            length: 10,
            omission: ''
          });

          params.to = _.truncate(params.to, {
            length: 10,
            omission: ''
          });

          params.indicators = _.snakeCase(params.indicators);

          return when(_.values(params))
            .spread(statsDomain.getContactsPerHour)
            .then((result) => {
              const output = {
                data: _.round(_.values(result.data)[0], 2)
              };
              params.clientName = result.client.clientName;
              params.clientId = result.client.clientId;
              params.indicators = _.lowerCase(params.indicators);
              params.datetime = (params.from === params.to) ? 'on ' + params.from : 'from ' + params.from + ' to ' + params.to;

              return _.merge(context, params, output);
            });
        })
        .catch((error) => {
          logger.error(error);
          return {error};
        });
    }
  };
};

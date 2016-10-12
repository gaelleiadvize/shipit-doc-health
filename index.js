'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node index.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  
  getContactsPerHour({context, entities}) {
    return new Promise(function(resolve, reject) {
      console.log(context);

      return resolve({
        contacts: 45,
        "client.name": 'Maty',
        "client.id":2
      });
    });
  },

  question({context, entities}) {
    return new Promise(function(resolve, reject) {
      console.log(context);

      return resolve({
        question: "first try",
      });
    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);

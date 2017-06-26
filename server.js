'use strict';

module.exports = (config, api) => {
  // Tout d'abbord on initialise notre application avec le framework Express
  // et la bibliothèque http integrée à node.
  var express = require('express');
  var app = express();
  var router = express.Router();
  var bodyParser = require('body-parser');
  var http = require('http').Server(app);

  // On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
  app.use('/', express.static(__dirname + "/ihm"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  router.get('/authenticate', api.authenticate.$get);

  router.get('/accessToken', api.accessToken.$get);

  router.post('/webhook/:action', api.webhook.$post);

  app.use(router);

  // On lance le serveur en écoutant les connexions arrivant sur le port du serveur
  http.listen(config.port, function(){
    console.log('IHM Server is listening on port ' + config.port);
  });
};

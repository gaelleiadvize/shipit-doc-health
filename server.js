'use strict';

module.exports = (config, api) => {
  // Tout d'abbord on initialise notre application avec le framework Express
  // et la bibliothèque http integrée à node.
  var express = require('express');
  var app = express();
  var http = require('http').Server(app);

  // On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
  app.use('/', express.static(__dirname + "/ihm"));

  app.route('/authenticate')
    .get(api.authenticate.$get);

  app.route('/accessToken')
    .get(api.accessToken.$get);

  // On lance le serveur en écoutant les connexions arrivant sur le port du serveur
  http.listen(config.port, function(){
    console.log('IHM Server is listening on port ' + config.port);
  });
};

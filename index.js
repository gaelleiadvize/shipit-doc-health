'use strict';

require('./bootstrap');

const config = require('./config');

const uuid = require ('uuid');
const errors = require('./errors')(console);
const sessionManager = require('./managers/session')(uuid, errors);
const socketManager = require('./managers/socket')(config.socket, errors, console, sessionManager);
const resources = require('./resources')(config.resources, errors, console);
const domain = require('./domain')(errors, resources);
const botManager = require('./botManager')(config.botManagers, errors, domain, console);

socketManager.create()
  .then(_.partial(botManager, sessionManager));

// Tout d'abbord on initialise notre application avec le framework Express
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/ihm"));

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(config.app.port, function(){
  console.log('IHM Server is listening on port ' + config.app.port);
});

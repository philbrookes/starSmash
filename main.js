var Game = require('./private/Game.js');
var Server = require('./private/Server.js');
var ws   = require("nodejs-websocket");
var express = require('express');

config = require('./config/config.json');

//Socket server
var server = ws.createServer(function(sock){
	Server.newConnection(sock);
}).listen(Server.socket);

//Web server
var app = express();
app.use('/', express.static('./public_html'));
app.listen(8080);
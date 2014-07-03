var Player = require("./Player.js");
var Game = require("./Game.js");

Server = function(){}

Server.socket = "8001";

Server.players = new Array();
Server.games = new Array();

Server.newConnection = function(sock){
	console.log("new connection");
	var player = new Player(sock);
	Server.players.push(player);
	var game = Server.findGame();
	game.addPlayer(player);
}

Server.findGame = function(){
	var retGame = false;
	Server.games.forEach(function(game, index){
		if(game.state === Game.PREPARING){
			retGame = game;
		}
	});
	if(retGame){
		return retGame;
	}
	var game = new Game();
	Server.games.push(game);
	return game;
}

Server.handleInput = function(player, data){
	data = JSON.parse(data);
	switch(data.command){
		case "setResources":
			player.getHq().resources = data.resources;
			break;
		case "build":
			player.build(data.unitType);
			break;
	}
}
module.exports = Server;
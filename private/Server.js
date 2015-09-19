var Player = require("./Player.js");
var Game = require("./Game.js");

Server = function(){};

Server.socket = "8001";

Server.players = [];
Server.games = [];

Server.newConnection = function(sock){
	console.log("new connection");
	var player = new Player(sock);
	Server.players.push(player);
	var game = Server.findGame();
	game.addPlayer(player);
};

Server.findGame = function(){
	var retGame = false;
	Server.games.forEach(function(game, index){
		if(game.state === Game.PREPARING){
			retGame = game;
		}
		if(game.state === Game.FINISHED){
			Server.removeGame(game);
		}
	});
	if(retGame){
		return retGame;
	}
	var game = new Game();
	Server.games.push(game);
	return game;
};

Server.handleInput = function(player, data){
	data = JSON.parse(data);
	switch(data.command){
/*		case "setResources":
			player.hq.resources = data.resources;
			break;
*/
		case "build":
			player.build(data.unitType);
			break;
		case "move":
			player.issueMove(data.unitId, data.destination);
	}
};

Server.removeGame = function(game){
	var i = Server.games.indexOf(game);
		if(i > -1){
			Server.games.splice(i, 1);
		}
};

Server.removePlayer = function(player){
	var i = Server.players.indexOf(player);
		if(i > -1){
			Server.players.splice(i, 1);
		}
};

module.exports = Server;
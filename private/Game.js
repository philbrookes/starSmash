var Board = require("./Board.js");

Game = function() {
	this.players = new Array();
	this.spectators = new Array();
	this.board = new Board(640, 480, 250);
}

Game.prototype = {
	addPlayer: function(player) {
		this.players.put(player);
	}
}

module.exports = Game;
var Board = require("./Board.js");

Game = function() {
	this.players = new Array();
	this.spectators = new Array();
	this.board = new Board(640, 480, 250);
	this.numPlayers = 2;
	this.state = Game.PREPARING;
}

Game.PREPARING = 1;
Game.READY     = 2;
Game.RUNNING   = 3;
Game.FINISHED  = 4;

Game.prototype = {
	addPlayer: function(player) {
		var me = this;
		
		this.players.push(player);
		player.game = this;

		if(this.players.length == this.numPlayers){
			this.state = Game.RUNNING;
			this.players.forEach(function(player, index){
				player.hq = player.grantUnit(
					"headquarters"
					, me.board.startingPosition(index)
				);
				me.sendToPlayers({"command": "updateUnit", "data": player.hq});
			});
		}
	},
	sendToPlayers: function(data){
		this.players.forEach(function(player){
			player.send(data);
		});
	}
}

module.exports = Game;
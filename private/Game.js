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
		this.players.push(player);
		player.game = this;

		if(this.players.length == this.numPlayers){
			this.startGame();
		}
	},
	sendToPlayers: function(data){
		this.players.forEach(function(player){
			player.send(data);
		});
	},
	startGame: function(){
		this.state = Game.RUNNING;
		for(var index in this.players){
			var player = this.players[index];
			player.hq = player.grantUnit(
				"headquarters"
				, this.board.startingPosition(index)
			);
			player.hq.position = this.board.startingPosition(index);
			console.log("player " + player.id);
			console.log(player.hq.position);
			this.sendToPlayers({"command": "updateUnit", "data": player.hq});
		};

		for(var index in this.players){
			var player = this.players[index];
			console.log("player " + player.id);
			console.log(player.hq.position);
		}
	}

}

module.exports = Game;
var Board = require("./Board.js");

Game = function() {
	this.players = [];
	this.spectators = [];
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

		if(this.players.length === this.numPlayers){
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
    var player;
    var i;
		for( i=0; i < this.players.length; i++ ){
			 player = this.players[i];
			 player.hq = player.grantUnit(
				"headquarters"
				, this.board.startingPosition(i)
			);

			console.log("player " + player.id);
			console.log(player.hq.position);
			this.sendToPlayers({"command": "updateUnit", "data": player.hq});
		};

		for(i =0; i < this.players.length; i++){
			player = this.players[i];
			console.log("player " + player.id);
			console.log(player.hq.position);
		}
	}

}

module.exports = Game;
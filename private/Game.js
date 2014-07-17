var Board = require("./Board.js");

Game = function() {
	this.players = new Array();
	this.spectators = new Array();
	this.board = new Board(640, 480, 250);
	this.numPlayers = 2;
	this.state = Game.PREPARING;
	this.stateTicker = null;
	this.processTicker = null;
	this.lastTick = null;
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
		this.sendToPlayers({
			"command": "starmap", 
			"data": {
				"stars": this.board.generateStars(), 
				"style" : config.star_style
			}
		});
		for(var index = 0; index < this.players.length; index++){
			var player = this.players[index];
			player.hq = player.grantUnit("headquarters", this.board.startingPosition(index));
		};

		this.stateTick();
		var me = this;
		this.stateTicker = setInterval(function(){
			me.stateTick();
		}, 1000);
		this.processTicker = setInterval(function(){
			me.processTick();
		}, 10);

	},
	stateTick: function(){
		for(var index = 0; index < this.players.length; index++){
			var player = this.players[index];
			for(var i = 0; i < player.army.length; i++){
				var unit = player.army[i];
				this.sendToPlayers({"command": "updateUnit", "data": unit});
			}
		}
	},
	processTick: function(){
		if(this.lastTick)
		{
			var timeElapsed = (new Date().getTime() - this.lastTick) / 1000;
		}
		for(var index = 0; index < this.players.length; index++){
			var player = this.players[index];
			for(var i = 0; i < player.army.length; i++){
				var unit = player.army[i];
				unit.process(timeElapsed);
			}
		}
		this.lastTick = new Date().getTime();
	}
}

module.exports = Game;
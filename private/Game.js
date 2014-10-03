var Board = require("./Board.js");

Game = function() {
	this.players = new Array();
	this.spectators = new Array();
	this.board = new Board(640, 480, 250, this);
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

		player.send({"command": "player_id", "value": player.id});
		if(this.players.length == this.numPlayers){
			this.startGame();
		} else {
			player.send({"command": "waiting_for_opponent"});
		}
	},
	removePlayer: function(player) {
		var i = this.players.indexOf(player);
		if(i > -1){
			this.players.splice(i, 1);
			Server.removePlayer(player);
		}
	},
	sendToPlayers: function(data){
		for(var i=0;i<this.players.length;i++){
			var player = this.players[i];
			try{
				player.send(data);
			} catch (ex) {
				console.log("exception: ", ex);
				this.removePlayer(player);
				this.end("A player disconnected");
				this.sendToPlayers({"command": "disconnect"});
				this.state = Game.FINISHED;
				break;
			}	
		}
	},
	end: function(reason){
		this.state = Game.FINISHED;
		clearInterval(this.stateTicker);
		clearInterval(this.processTicker);
		this.sendToPlayers({"command": "end", "data": reason});
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
			player.grantUnit("gatherer");
		};


		var me = this;
		this.processTicker = setInterval(function(){
			me.processTick();
		}, 10);

	},
	sendUnitUpdate: function(unit){
		this.sendToPlayers({"command": "updateUnit", "data": unit.forJson()});
	},
	removeUnit: function(unit){
		if(typeof unit.player !== "undefined"){
			unit.player.delUnit(unit);
		}
		this.sendToPlayers({"command": "removeUnit", "data": unit.forJson()});
	},
	processTick: function(){
		if(this.lastTick){
			var timeElapsed = (new Date().getTime() - this.lastTick) / 1000;
		}
		for(var index = 0; index < this.players.length; index++){
			var player = this.players[index];
			for(var i = 0; i < player.army.length; i++){
				var unit = player.army[i];
				unit.process(timeElapsed);
			}
		}
		for(var index = 0; index < this.board.missiles.length; index++){
			var missile = this.board.missiles[index];
			missile.process(timeElapsed);

		}
		this.lastTick = new Date().getTime();
	}
}

module.exports = Game;
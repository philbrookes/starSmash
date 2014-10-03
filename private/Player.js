var ShipFactory = require("./Ship/Factory.js")();

var plyrId = 1;
Player = function(socket) {
	this.id = plyrId++;
	this.shipIdTracker = 1;
	
	this.sock = socket;
	
	this.game = null;
	this.army = new Array();
	this.hq = {};
	this.resources = 0;

	this.name = "NO NAME, NO GAME";
	
	var me = this;
	this.sock.on("text", function(evt){
		Server.handleInput(me, evt);
	});
}

Player.prototype = {
	send: function(data) {
		try{
			this.sock.sendText(JSON.stringify(data));
		} catch (ex) {
			this.game.removePlayer(this);
			this.game.end("A player disconnected");
			this.game.sendToPlayers({"command": "disconnect"});
			this.state = Game.FINISHED;
		}
	},
	generateId: function(unitType){
		return this.id + "_" + unitType.substr(0, 3) + "_" + this.shipIdTracker++;
	},
	issueMove: function(itemId, destination){
		for(var i in this.army){
			var ship = this.army[i];
			if(ship.id === itemId){
				ship.destination.x = destination.x;
				ship.destination.y = destination.y;
				this.game.sendUnitUpdate(ship);
				return;
			}
		}
	},
	delUnit: function(unit){
		var i = this.army.indexOf(unit);
		if(i > -1){
			this.army.splice(i, 1);
		}
	},
	grantUnit: function(unitType, pos){
		var ship = {};
		switch(unitType){
			case "headquarters":
				ship = ShipFactory.buildHeadquarters(this, pos);
				break;
			case "gatherer":
				ship = ShipFactory.buildGatherer(this);
				break;
			case "attacker":
				ship = ShipFactory.buildAttacker(this);
				break;
			case "defender":
				ship = ShipFactory.buildDefender(this);
				break;
		}
		this.game.sendUnitUpdate(ship);

		return ship;
	},
	build: function(unitType){
		if(this.hq.resources < config.ship[unitType].cost){
			this.send({"command": "build", "data": {"status": "fail"}});
			return;
		}

		this.incrementResources(- config.ship[unitType].cost);
		var ship = this.grantUnit(unitType);
		return ship;
	},
	incrementResources: function(amount){
		this.hq.resources += amount;
		this.send({"command": "resourceUpdate", "data": {"amount": this.hq.resources}});
	}
}

module.exports = Player;
var Ship = require("./Ship.js");

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
		this.sock.sendText(JSON.stringify(data));
	},
	generateId: function(unitType){
		return this.id + "_" + unitType.substr(0, 3) + "_" + this.shipIdTracker++;
	},
	grantUnit: function(unitType, pos){
		if(typeof pos === "undefined"){
			pos = {};
			pos.x = this.hq.position.x;
			pos.y = this.hq.position.y;
		}
		var template = config.ship[unitType];
		var ship = new Ship(this);
		ship.id = this.generateId(unitType);
		ship.maxHp = template.maxHp;
		ship.currentHp = ship.maxHp;
		
		ship.speed = template.speed;
		ship.position = pos;	
		ship.destination.x = ship.position.x;
		ship.destination.y = ship.position.y;

		ship.weapons = template.weapons;

		ship.style = template.style;

		ship.gather_radius = template.gather_radius;

		this.army.push(ship);

		this.game.sendUnitUpdate(ship);

		return ship;
	},
	build: function(unitType){
		if(this.hq.resources < config.ship[unitType].cost){
			this.send({"command": "build", "data": {"status": "fail"}});
			return;
		}

		this.hq.resources -= config.ship[unitType].cost;
		var ship = this.grantUnit(unitType);
		this.game.sendUnitUpdate(ship);

		return ship;
	}
}

module.exports = Player;
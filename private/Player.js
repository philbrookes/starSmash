var plyrId = 1;
Player = function(socket) {
	this.id = plyrId++;
	this.shipIdTracker = 1;
	
	this.sock = socket;
	
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
	setName: function(name) {
		if(/^[a-z0-9]+$/i.test(name)){
			this.name = name;
			return true;
		}
		return false;
	},
	send: function(data) {
		this.sock.sendText(JSON.stringify(data));
	},
	startGame: function(pos){
		this.hq = this.grantUnit("headquarters", pos);
		this.send({"command": "updateUnit", "data": this.hq});
	},
	generateId: function(unitType){
		return this.id + "_" + unitType.substr(0, 3) + "_" + this.shipIdTracker++;
	},
	grantUnit: function(unitType, pos){
		if(typeof pos == "undefined"){
			pos = this.hq.position;
		}
		var ship = config.ship[unitType];
		ship.id = this.generateId(unitType);
		ship.currentHp = ship.maxHp;
		ship.position = pos;	
		
		ship.destination = ship.position;
		return ship;
	},
	build: function(unitType){
		if(this.hq.resources < config.ship[unitType].cost){
			this.send({"command": "build", "data": {"status": "fail"}});
			return;
		}
		this.resources -= config.ship[unitType].cost;
		
		var ship = this.grantUnit(unitType);

		ship.destination = {
			"x": 500 - Math.floor(Math.random() * 200) + 1, 
			"y": 350 - Math.floor(Math.random() * 200) + 1, 
		};
		this.send({"command": "updateUnit", "data": ship});
		return ship;
	}
}

module.exports = Player;
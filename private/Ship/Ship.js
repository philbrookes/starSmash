var Position = require("../Position.js");
var _ = require("underscore");
Ship = function(player) {
	this.player = player;
	this.id = null;
	this.maxHp = null;
	this.currentHp = null;
	
	this.speed = null;
	this.position = new Position();	
	this.destination = new Position();

	this.weapons = [];

	this.style = {};

	this.gather_radius = null;
	this.carrying_energy = false;
	this.target = {};
	this.canMove = false;

	this.resources = 0;
};

Ship.prototype = {
	forJson: function(){
		return {
			"id": this.id,
			"maxHp": this.maxHp,
			"currentHp": this.currentHp,
			"speed": this.speed,
			"position": this.position,
			"destination": this.destination,
			"weapons": this.weapons,
			"style": this.style,
			"gather_radius": this.gather_radius,
			"canMove": this.canMove,
			"playerId": this.player.id
		};
	},
	alterHp: function(amount){
		this.currentHp += amount;
		if(this.currentHp <= 0){
			this.destroy();
		}
		if(this.currentHp > this.maxHp){
			this.currentHp = this.maxHp;
		}
	},
	destroy: function(){
		this.player.game.removeUnit(this);
	}
};

module.exports = Ship;

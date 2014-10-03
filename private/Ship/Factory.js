var _ = require("underscore");

var Position = require("../Position.js");

var Ship = require("./Ship.js");
var Mover = require("./mover.js");
var Gatherer = require("./gatherer.js");
var Combat = require("./combat.js");

module.exports = function(){
	return {
		buildHeadquarters: function(player, pos){
			var ship = buildGenericShip(config.ship.headquarters, player, pos);

			ship.id = player.generateId('headquarters');
			
			headquartersMethods(ship);

			player.army.push(ship);
			return ship;
		},
		buildGatherer: function(player){
			var ship = buildGenericShip(config.ship.gatherer, player, player.hq.position);

			ship.id = player.generateId('gatherer');
			
			gathererMethods(ship);

			player.army.push(ship);
			return ship;
		},
		buildAttacker: function(player, pos){
			var ship = buildGenericShip(config.ship.attacker, player, player.hq.position);

			ship.id = player.generateId('attacker');
			
			attackerMethods(ship);

			player.army.push(ship);
			return ship;

		},
		buildDefender: function(player, pos){
			var ship = buildGenericShip(config.ship.defender, player, player.hq.position);

			ship.id = player.generateId('defender');
			
			defenderMethods(ship);

			player.army.push(ship);
			return ship;
		}
	}	
}

function buildGenericShip(template, player, pos){
	var ship = new Ship(player);
	
	ship.maxHp = template.maxHp;
	ship.currentHp = ship.maxHp;
	
	ship.speed = template.speed;
	
	ship.canMove = template.canMove;
	_.each(template.weapons, function(weapon, i){
		var shipWeapon = {};
		shipWeapon.damage = weapon.damage;
		shipWeapon.reload = weapon.reload;
		shipWeapon.range = weapon.range;
		shipWeapon.color = weapon.color;
		shipWeapon.loaded = weapon.loaded;
		shipWeapon.loadingTimer = weapon.loadingTimer;
		ship.weapons.push(shipWeapon);
	})
	ship.style = template.style;
	ship.gather_radius = template.gather_radius;

	ship.position.copy(pos);
	ship.destination.copy(pos);

	return ship;
}

function attackerMethods(ship){
	ship.getType = function(){ return "attacker"; }
	_.extend(ship, Mover.prototype);
	_.extend(ship, Combat.prototype);
}

function defenderMethods(ship){
	ship.getType = function(){ return "defender"; }
}

function gathererMethods(ship){
	ship.getType = function(){ return "gatherer"; }
	_.extend(ship, Mover.prototype);
	_.extend(ship, Gatherer.prototype);
}

function headquartersMethods(ship){
	ship.getType = function(){ return "headquarters"; }
	_.extend(ship, Mover.prototype);
}

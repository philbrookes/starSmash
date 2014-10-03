var _ = require("underscore");

var Combat = function(){
	
}

Combat.prototype = {
	process: function(timeElapsed){
		this.findTarget();
		//don't get too close
		if(this.position.distance(this.target.position) > 100){
			this.movement(timeElapsed);
		} else {
			this.setDestination(this.position);
		}
		this.reload(timeElapsed);
		this.shoot();
	},
	findTarget: function(){
		var closest = {distance: 99999999, unit: {}};
		var me = this;
		_.each(this.player.game.players, function(player, i){
			if(player.id === me.player.id){
				//don't target you're own units!
				return;
			}

			_.each(player.army, function(unit, i){
				distance = me.position.distance(unit.position);
				if(distance < closest.distance){
					closest.unit = unit;
					closest.distance = distance;
				}
			});
		});
		if(typeof closest.unit.position !== "undefined"){
			this.setTarget(closest.unit);
		}
	},
	arrived: function(){ /*nothing to do here*/ },
	shoot: function(){
		var me = this;
		_.each(this.weapons, function(weapon, i){
			if(weapon.loaded === true){
				if(me.position.distance(me.target.position) < weapon.range){
					weapon.loaded = false;
					weapon.loadingTimer = 0;
					me.player.game.board.addMissile(me.position, weapon.damage, weapon.color, me.target);
				}
			}
		});
	},
	reload: function(timeElapsed){
		_.each(this.weapons, function(weapon, i){
			if(weapon.loaded === false){
				weapon.loadingTimer += timeElapsed;
				if(weapon.loadingTimer >= weapon.reload){
					weapon.loaded = true;
				}
			}
		});
	}
}

module.exports = Combat;
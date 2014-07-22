Ship = function(player) {
	this.player = player;
	this.id = null;
	this.maxHp = null;
	this.currentHp = null;
	
	this.speed = null;
	this.position = {};	
	this.destination = {};

	this.weapons = [];

	this.style = {};

	this.gather_radius = null;
	this.carrying_energy = false;
	this.target = {};
}

Ship.prototype = {
	process: function(timeElapsed){
		this.findTarget();
		this.shoot(timeElapsed);
		if(this.position.x != this.destination.x || this.position.y != this.position.x){
			this.movement(timeElapsed);
		}
	},
	setDestination: function(position){
		if(this.destination.x != position.x && this.destination.y != position.y){
			this.destination.x = position.x;
			this.destination.y = position.y;
			this.player.game.sendUnitUpdate(this);
		}
	},
	setTarget: function(unit){
		this.target = unit;
		this.setDestination(unit.position);
	},
	findTarget: function(){
		if(this.gather_radius && this.carrying_energy){
			this.setDestination(this.player.hq.position);
		} else if(this.gather_radius) {

			if(this.target.tapped === false){
				return;
			}
			//star is tapped, find a new one
			var stars = this.player.game.board.stars;
			var closestStar = null;
			var closestDist = 9999999;
			for(var i=0;i<stars.length;i++){
				var star = stars[i];

				//skip tapped stars
				if(star.tapped){
					continue;
				}
				var tx = star.position.x - this.position.x;
    			var ty = star.position.y - this.position.y;
    			var dist = Math.sqrt(tx*tx+ty*ty);
    			if(dist < closestDist){
    				closestStar = star;
    				closestDist = dist;
    			}
			}
			this.setTarget(closestStar);
		}
	},
	shoot: function(timeElapsed){
		if(this.gather_radius){
			var tx = this.target.position.x - this.position.x;
			var ty = this.target.position.y - this.position.y;
			var dist = Math.sqrt(tx*tx+ty*ty);
			if(this.carrying_energy == false && dist < this.gather_radius ){
				this.target.tap();
				this.carrying_energy = true;
			}
		}
	},
	movement: function(timeElapsed){
		//dont move if we're at the destination already
		if(this.position.x == this.destination.x && this.position.y == this.destination.y){
			return;
		}

		var tx = this.destination.x - this.position.x,
    	ty = this.destination.y - this.position.y,
    	dist = Math.sqrt(tx*tx+ty*ty),
    	rad = Math.atan2(ty,tx),
    	angle = rad/Math.PI * 180;

    	if(dist > (this.speed * timeElapsed)){
	    	var velX = (tx/dist) * (this.speed * timeElapsed);
	    	var velY = (ty/dist) * (this.speed * timeElapsed);

    		this.position.x += velX;
			this.position.y += velY;
    	} else {
    		this.position.x = this.destination.x;
    		this.position.y = this.destination.y;
    		this.player.game.sendUnitUpdate(this);
    	}
	},
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
			"gather_radius": this.gather_radius
		};
	}
}

module.exports = Ship;
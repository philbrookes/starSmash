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
}

Ship.prototype = {
	process: function(timeElapsed){
		if(this.position.x != this.destination.x || this.position.y != this.position.x){
			this.movement(timeElapsed);
		}

	//	this.weapons(timeElapsed);
	},
	movement: function(timeElapsed){
		var tx = this.destination.x - this.position.x,
    	ty = this.destination.y - this.position.y,
    	dist = Math.sqrt(tx*tx+ty*ty),
    	rad = Math.atan2(ty,tx),
    	angle = rad/Math.PI * 180;

    	var velX = (tx/dist) * (this.speed * timeElapsed);
    	var velY = (ty/dist) * (this.speed * timeElapsed);

    	if(dist > (this.speed * timeElapsed)){
    		this.position.x += velX;
			this.position.y += velY;
    	} else {
    		this.position.x = this.destination.x;
    		this.position.y = this.destination.y;
    	}
	},
	weapons: function(timeElapsed){

	}
}

module.exports = Ship;
var Mover = function(){
};

Mover.prototype = {
	process: function(timeElapsed){
		this.movement(timeElapsed);
	},
	movement: function(timeElapsed){
		//dont move if we're at the destination already
	    if(this.position.x === this.destination.x && this.position.y === this.destination.y){
	    	if(typeof this.arrived !== "undefined"){
	        	this.arrived();
	        }
	  		return;
	    }

	    var tx = this.destination.x - this.position.x,
	    ty = this.destination.y - this.position.y;
	    
	    var dist = this.position.distance(this.destination);
	    var angle = this.position.angle(this.destination);

	    if(dist > (this.speed * timeElapsed)){
	    	var velX = (tx/dist) * (this.speed * timeElapsed);
	    	var velY = (ty/dist) * (this.speed * timeElapsed);

    		this.position.x += velX;
		    this.position.y += velY;
	    } else {
    		this.position.x = this.destination.x;
    		this.position.y = this.destination.y;
	    }
	},
	setDestination: function(position){
		if(this.destination.x !== position.x && this.destination.y !== position.y){
			this.destination.copy(position);
			this.player.game.sendUnitUpdate(this);
		}
	},
	setTarget: function(unit){
		this.target = unit;
		this.setDestination(unit.position);
	}
};



module.exports = Mover;
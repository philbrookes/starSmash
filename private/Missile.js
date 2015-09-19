var Position = require("./Position.js");
var id = 0;
var Missile = function(board, pos, damage, color, target){
	this.id = "miss_" + id++;
	this.board = board;
	this.position = new Position();
	this.position.copy(pos);
	this.destination = new Position();
	this.damage = damage;
	this.target = target;
	this.speed = 150;
	this.style = {
		"width": 1,
		"height": 1,
		"color": color
	};
};

Missile.prototype = {
	process: function(timeElapsed){
		if(!this.destination.equals(this.target.position)){
			this.destination.copy(this.target.position);
			this.board.game.sendUnitUpdate(this);
		}
		this.movement(timeElapsed);
	},
	movement: function(timeElapsed){
		//dont move if we're at the destination already
	    if(this.position.x === this.destination.x && this.position.y === this.destination.y){
		  this.arrived();
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
            this.arrived();
	    }
	},
	arrived: function(){
		this.target.alterHp(- this.damage);
		this.board.delMissile(this);
	},
	forJson: function(){
		return {
			"id": this.id,
			"speed": this.speed,
			"position": this.position,
			"destination": this.destination,
			"style": this.style
		};
	},
};

module.exports = Missile;
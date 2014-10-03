Position = function(x, y) {
	this.x = x;
	this.y = y;
}

Position.prototype = {
	set: function(x, y) {
		this.x = x;
		this.y = y;
	},
	setX: function(x){
		this.x = x;
	},
	setY: function(y){
		this.y = y;
	},
	copy: function(pos){
		this.x = pos.x;
		this.y = pos.y;
	},
	equals: function(pos){
		return (this.x == pos.x && this.y == pos.y);
	},
	distance: function(pos){
		var tx = pos.x - this.x,
	    ty = pos.y - this.y;
	    return Math.sqrt(tx*tx+ty*ty);
	},
	angle: function(pos){
		var tx = pos.x - this.x,
	    ty = pos.y - this.y,
	    rad = Math.atan2(ty,tx);
	    return rad/Math.PI * 180;
	}
}

module.exports = Position;
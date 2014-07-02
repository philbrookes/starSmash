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
	}
}

module.exports = Position;
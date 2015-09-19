Position = function(x, y){
	this.x = x;
	this.y = y;
};

Position.prototype = {
	setX: function(x){
		this.x = x;
	},
	setY: function(y){
		this.y = y;
	}
};
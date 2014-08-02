Renderer = function(canvasId){
	this.canvas = document.getElementById(canvasId);
	if(! this.canvas.getContext("2d")){
		console.log("cannot get context!");
	}
	this.context = this.canvas.getContext("2d");
	this.bgColor = "#aaaacc";
	this.lastRender = null;
}

Renderer.prototype = {
	setClearColor: function(color){
		this.bgColor = color;
	},
	render: function(game){
		if(this.lastRender){
			var timeElapsed = (new Date().getTime() - this.lastRender) / 1000;
		}
		this.lastRender = new Date().getTime();

		this.clear(this.bgColor);
		for(i in game.items){
			this.context.save();
			if(typeof(game.items[i].render == "function")){
				game.items[i].render(this.context, timeElapsed);
			}
			this.context.restore();
		}
	},
	clear: function(color) {
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
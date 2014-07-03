var Star = require("./Star.js");
var Position = require("./Position.js");

function Board(width, height, numStars){
	this.width = width;
	this.height = height;
	this.numStars = numStars;
	this.stars = new Array();
}

Board.prototype = {
	generateStars: function() {
		for(var i=0;i<this.numStars;i++){
			var pos = new Position(
				Math.floor(Math.random()*(this.width + 1)),
				Math.floor(Math.random()*(this.height + 1))
			);
			var star = new Star(pos);
			star.id = i;
			this.stars.push(star);
		}
		return this.stars;
	},
	startingPosition: function(index){
    var pos;
		switch(index){
			case '0':
				 pos = {"x": 50, "y": 50};
				break;
			case '1':
				 pos =  {"x": this.width - 50, "y": this.height - 50};
				break;
			case '2':
				 pos =  {"x": this.width - 50, "y": 50};
				break;
			case '3':
				 pos =  {"x": 50, "y": this.height - 50};
				break;
		}
		return pos;
	}
}

module.exports = Board;
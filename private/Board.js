var Star = require("./Star.js");
var Position = require("./Position.js");

function Board(width, height, numStars){
	this.width = width;
	this.height = height;
	this.numStars = numStars;
	this.stars = new Array();
}

Board.prototype = {
	output: function() {
		console.log("test");
	},
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
	}
}

module.exports = Board;
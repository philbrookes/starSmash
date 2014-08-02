Star = function (position, board) {
	this.id;
	this.position = position;
	this.tapped = false;
	this.energy = 1;
	this.rechargeTime = 60;
	this.board = board;
	this.style = config.star_style;
}

Star.prototype = {
	setEnergy: function(energy){
		this.energy = energy;
	},
	tap: function(){
		this.tapped = true;
		this.style = config.tapped_star_style;
		var me = this;
		setTimeout(function(){me.untap();}, this.rechargeTime * 1000);
		this.board.game.sendUnitUpdate(this);
	},
	untap: function(){
		this.tapped = false;
		this.style = config.star_style;
		this.board.game.sendUnitUpdate(this);
	},
	forJson: function(){
		return {
			"position": this.position,
			"tapped": this.tapped,
			"energy": this.energy,
			"id": this.id,
			"style": this.style
		}
	}
}

module.exports = Star;
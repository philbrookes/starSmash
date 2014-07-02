Star = function (position) {
	this.id;
	this.position = position;
	this.tapped = false;
	this.energy = 1;
	this.rechargeTime = 60;
}

Star.prototype = {
	setEnergy: function(energy){
		this.energy = energy;
	},
	tap: function(){
		this.tapped = true;
	},
	untap: function(){
		this.tapped = false;
	}
}

module.exports = Star;
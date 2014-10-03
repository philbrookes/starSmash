var _ = require("underscore");
var gatherer = function(){
};
gatherer.prototype = {
	process: function(timeElapsed){
		this.findTarget();
		this.movement(timeElapsed);
	},
	findTarget: function(){
		if(this.carrying_energy){
			this.setDestination(this.player.hq.position);
		} else {
			if(this.target.tapped === false){
				return;
			}
			//star is tapped, find a new one
			var stars = this.player.game.board.stars;
			
			var closest = {distance: 99999999, star: {}};
			var me = this;
			_.each(stars, function(star, i){
				//don't harvest tapped stars
				if(star.tapped){
					return;
				}
				distance = me.position.distance(star.position);
				if(distance < closest.distance){
					closest.star = star;
					closest.distance = distance;
				}
			});
			if(typeof closest.star.position !== "undefined"){
				this.setTarget(closest.star);
			}
		}
	},
    arrived: function(){
        this.player.game.sendUnitUpdate(this);

        if(this.gather_radius && this.carrying_energy){
            this.carrying_energy = false;
            this.player.incrementResources(1);
        } else if(this.gather_radius && ! this.carrying_energy){
            this.carrying_energy = true;
            this.target.tap();
        }
    },
}

module.exports = gatherer;
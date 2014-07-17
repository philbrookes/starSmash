Item = function(id){
	this.id = id;
	this.style = {};
	this.position = {};
	this.destination = {};
	this.speed = null;
	this.pursueId = null;
	this.currentHp = null;
	this.maxHp = null;
	this.tapped = null;
	this.image = null;
	this.imageReady = false;
}

Item.prototype = {
	render: function(context){
		this.movement();

		context.translate(this.position.x, this.position.y);

		if(this.maxHp != null){
			this.drawHpBar(context);
		}

		this.rotate(context);
		if(this.imageReady){
			context.drawImage(
				this.image, 
				-(this.style.width / 2), 
				-(this.style.height / 2), 
				this.style.width, 
				this.style.height
			);
		} else {
			context.fillStyle = this.style.color;
			context.fillRect(
				-(this.style.width / 2), 
				-(this.style.height / 2),
				this.style.width,
				this.style.height
			);

			context.strokeStyle = "#ffff99";
	      	context.beginPath();
	      	context.moveTo(0, 0);
	      	context.lineTo(0, -10);
	      	context.lineWidth = 1;
	      	context.stroke();
      	}
	},
	drawHpBar: function(context){
		context.fillStyle = "#000000";
		context.fillRect(-this.style.width, -(this.style.height - 2), this.style.width * 2, 3);

		context.fillStyle = "#00ff00";
		var percent = (this.currentHp / this.maxHp);
		if(percent <= 0){
			percent = 0;
		}
		var hpLength = ((this.style.width * 2) - 2) * percent;
		context.fillRect(-(this.style.width)+1, -(this.style.height - 3), hpLength, 1);
	},
	rotate: function(context){
		var deltaX = this.position.x - this.destination.x;
		var deltaY = this.position.y - this.destination.y;
		var rot = Math.atan2(deltaX, deltaY);
		if(rot < 0){
			rot = Math.abs(rot);
		} else {
			rot = 2 * Math.PI - rot;
		}
		context.rotate(rot);
	},
	update: function(data){
		this.position = data.position;
		this.destination = data.destination;
		this.pursueId = data.pursueId;
		this.currentHp = data.currentHp;
		this.maxHp = data.maxHp;
		this.tapped = data.tapped;
		this.speed = data.speed;
	},
	movement: function(){
		var tx = this.destination.x - this.position.x,
    	ty = this.destination.y - this.position.y,
    	dist = Math.sqrt(tx*tx+ty*ty),
    	rad = Math.atan2(ty,tx),
    	angle = rad/Math.PI * 180;

    	var velX = (tx/dist) * (this.speed * Renderer.timeElapsed);
    	var velY = (ty/dist) * (this.speed * Renderer.timeElapsed);

    	if(dist > (this.speed * Renderer.timeElapsed)){
    		this.position.x += velX;
			this.position.y += velY;
    	} else {
    		this.position.x = this.destination.x;
    		this.position.y = this.destination.y;
    	}
	}
}
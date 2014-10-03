Ui = function(canvasId){
	var me = this;
	this.game = {};
	$("#" + canvasId).mousedown(function(evt){
		//me.mousedown(evt);
	});

	$("#" + canvasId).mouseup(function(evt){
		//me.mouseup(evt);
	});

	$("#" + canvasId).mousemove(function(evt){
		//me.mousemove(evt);
	});
	this.clicked = false;
	this.clickTime = null;
	this.startPos = {x: 0, y: 0};
	this.curPos = {x: 0, y: 0};
}

Ui.prototype = {
	mousedown: function(event){
		this.clicked = true;
		this.clickTime = new Date().getTime();
		this.startPos = {x: event.offsetX, y: event.offsetY};
	},
	mouseup: function(event){
		this.clicked = false;
		var downTime = (new Date().getTime() - this.clickTime);
		console.log(downTime);
		//greater than 200ms is a drag
		if(downTime > 200){
			console.log("selecting");
			this.game.selectItems(this.startPos, {x: event.offsetX, y: event.offsetY});	
		} else {
			console.log("moving");
			if(this.game.selectedItems.length > 0){
				for(var i in this.game.selectedItems){
					var item = this.game.selectedItems[i];
					client.moveUnit(item.id, {x: event.offsetX, y: event.offsetY});
				}
			}
		}
		
	},
	mousemove: function(event){
		this.curPos = {x: event.offsetX, y: event.offsetY};
	},
	render: function(context, timeElapsed){
		if(! this.clicked){
			return;
		}
		context.fillStyle = "rgba(200, 255, 75, 0.3)";
		context.strokeStyle = "#ddff99	";
		context.lineWidth = "4px";
		context.fillRect(this.startPos.x, this.startPos.y, this.curPos.x - this.startPos.x, this.curPos.y - this.startPos.y);
		context.strokeRect(this.startPos.x, this.startPos.y, this.curPos.x - this.startPos.x, this.curPos.y - this.startPos.y);
	}
}
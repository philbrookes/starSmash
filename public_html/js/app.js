Client = function(game){
  var me = this;
	this.sock = new WebSocket("ws://" + window.location.hostname + ":8001");

  $(window).on('beforeunload', function(){
    me.sock.close();
  });

  this.sock.onmessage = function(evt){
		me.processCommand(evt);	
	}
	this.game = game;
}

Client.prototype = {
	sendCommand: function(data){
		this.sock.send(JSON.stringify(data));
	},
	setResources: function(resources){
		var data = {};
		data.command = "setResources";
		data.resources = resources;
		console.log("sending:", data);
		this.sendCommand(data);
	},
	buildUnit: function(unitType){
		var data = {};
		data.command = "build";
		data.unitType = unitType;
		this.sendCommand(data);
	},
	moveUnit: function(unitId, destination){
		var data = {};
		data.command = "move";
		data.unitId = unitId;
		data.destination = destination;
		this.sendCommand(data);
	},
	processCommand: function(evt){
		var data = JSON.parse(evt.data);
		switch(data.command){
			case "updateUnit":
				this.updateUnit(data.data);
				break;
			case "removeUnit":
				this.removeUnit(data.data);
				break;
			case "starmap":
				$("#waiting").hide();
				this.starmap(data.data);
				break;
			case "player_id":
				this.setPlayerId(data);
				break;
			case "resourceUpdate":
				this.updateResources(data.data);
				break;
			case "disconnect":
				this.sock.close();
				$("#waiting").html("disconnected, please refresh");
				$("#waiting").show();
				break;
			case "waiting_for_opponent":
				$("#waiting").html("waiting for an opponent");
				$("#waiting").show();
		}
	},
	setPlayerId: function(data){
		this.game.playerId = data.value;
	},
	removeUnit: function(data){
		var item = this.game.getItem(data.id);
		if(! item){
			return;
		}
		this.game.delItem(item);
	},
	updateUnit: function(data){
		var item = this.game.getItem(data.id);
		if(! item){
			var item = new Item(data.id);
			this.game.addItem(item);
		}
		if(typeof data.style === "object"){
			item.style = data.style;
			if(item.style.image){
				item.image = new Image();
				item.image.src = item.style.image;
				item.image.onload = function(){
					item.imageReady = true;
				}
			}
		}
		if(typeof data.position === "object"){
			item.position = data.position;
		}
		if(typeof data.destination === "object"){
			item.destination = data.destination;
		}
		if(typeof data.currentHp === "number"){
			item.currentHp = data.currentHp;
		}
		if(typeof data.speed === "number"){
			item.speed = data.speed;
		}
		if(typeof data.maxHp === "number"){
			item.maxHp = data.maxHp;
		}
		if(typeof data.playerId === "number"){
			item.playerId = data.playerId;
		}
		if(typeof data.canMove === "boolean"){
			item.canMove = data.canMove;
		}
	},
	starmap: function(data){
		var star;
		for(var i=0;i<data.stars.length;i++){
			star = new Item(data.stars[i].id);
			star.style = data.style;
			star.position = data.stars[i].position;
			star.destination = star.position;
			star.canMove = false;
			this.game.addItem(star);
		}
	},
	updateResources: function(data){
		$("#resources").html("ore: " + data.amount);
		if(data.amount >= 3){
			$("#gatherer").addClass("available");
		} else {
			$("#gatherer").removeClass("available");
		}
		if(data.amount >= 15){
			$("#attacker").addClass("available");
		} else {
			$("#attacker").removeClass("available");
		}
	}
}
Game = function(ui){
	this.ui = ui;
	this.ui.game = this;
	this.items = new Array();
	this.selectedItems = [];
	this.playerId = null;
}

Game.prototype = {
	addItem: function(item) {
		this.items.push(item);
	},
	delItem: function(item) {
		var index = this.items.indexOf(item);
		if(index != -1){
			this.items.splice(index, 1);
		}
	},
	clearItems: function() {
		this.items = new Array();
	},
	getItem: function(id) {
		for(i in this.items){
			if(this.items[i].id == id){
				return this.items[i];
			}
		}
		return false;
	},
	selectItems: function(startPos, endPos){
		this.selectedItems = [];
		var startX = startPos.x,
			startY = startPos.y,
			endX = endPos.x,
			endY = endPos.y;
		if(startX > endX){
			startX = endPos.x;
			endX = startPos.x;
		}
		if(startY > endY){
			startY = endPos.y;
			endY = startPos.y;
		}

		for(i in this.items){
			var item = this.items[i];
			var pos = item.position;
			if(!item.canMove || item.playerId != this.playerId){
				continue;
			}
			if(pos.x >= startX && endX >= pos.x 
				&& pos.y >= startY && endY >= pos.y ){
				item.selected = true;
				this.selectedItems.push(item);
			} else {
				item.selected = false;
			}
		}
	}
}
Item = function(id){
	this.id = id;
	this.playerId;
	this.canMove = false;
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
	render: function(context, timeElapsed){
		this.movement(timeElapsed);

		context.translate(this.position.x, this.position.y);

		if(this.selected === true){
			context.strokeStyle = "#ffffff";
			context.strokeRect(
				-((this.style.width+2) / 2), 
				-((this.style.height+2) / 2),
				this.style.width+2,
				this.style.height+2
			);
		}

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
		this.canMove = data.canMove;
		this.playerId = data.playerId;
	},
	movement: function(timeElapsed){
	    var tx = this.destination.x - this.position.x,
        ty = this.destination.y - this.position.y,
	    dist = Math.sqrt(tx*tx+ty*ty);
        
	    if(dist > (this.speed * timeElapsed)){
    		var velX = (tx/dist) * (this.speed * timeElapsed);
    		var velY = (ty/dist) * (this.speed * timeElapsed);
    		
    		this.position.x += velX;
		    this.position.y += velY;
	    } else {
    		this.position.x = this.destination.x;
    		this.position.y = this.destination.y;
	    }
	}
}

Position = function(x, y){
	this.x = x;
	this.y = y;
}

Position.prototype = {
	setX: function(x){
		this.x = x;
	},
	setY: function(y){
		this.y = y;
	}
}
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
		game.ui.render(this.context, timeElapsed);
	},
	clear: function(color) {
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
Style = function(){
	this.width = 2;
	this.height = 2;
	this.color = "#ff0000";
}
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
var renderer, game, client, ui;

$(document).ready(function(){
	ui = new Ui("canvas");
	renderer = new Renderer("canvas");
	renderer.bgColor = "3D3D3D";
	game = new Game(ui);
	client = new Client(game);
	renderTick();
});
function renderTick(){
	renderer.render(game)
	requestAnimationFrame(renderTick);
}
Client = function(game){
	this.sock = new WebSocket("ws://127.0.0.1:8001");
	var me = this;
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
		data.command = "setResouces";
		data.resources = resources;
		this.sendCommand(data);
	},
	buildUnit: function(unitType){
		var data = {};
		data.command = "build";
		data.unitType = unitType;
		this.sendCommand(data);
	},
	moveUnit: function(unitId, pos){
		var data = {};
		data.command = "move";
		data.unitId = unitId;
		data.position = pos;
		this.sendCommand(data);
	},
	processCommand: function(evt){
		var data = JSON.parse(evt.data);
		switch(data.command){
			case "updateUnit":
				this.updateUnit(data.data);
				break;
			case "starmap":
				this.starmap(data.data);
				break;
		}
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
	},
	starmap: function(data){
		var star;
		for(var i=0;i<data.stars.length;i++){
			star = new Item(data.stars[i].id);
			star.style = data.style;
			star.position = data.stars[i].position;
			star.destination = star.position;
			this.game.addItem(star);
		}
	}
}
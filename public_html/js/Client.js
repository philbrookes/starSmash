Client = function(game){
	this.sock = new WebSocket("ws://localhost:8001");
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
		item.style = data.style;
		if(item.style.image){
			item.image = new Image();
			item.image.src = item.style.image;
			item.image.onload = function(){
				item.imageReady = true;
			}
		}
		item.position = data.position;
		item.destination = data.destination;
		item.currentHp = data.currentHp;
		item.speed = data.speed;
		item.maxHp = data.maxHp;
	},
	starmap: function(data){

	}
}
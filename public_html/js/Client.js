Client = function(game){
	this.sock = new WebSocket("ws://www.starsmash.com.dev:8001");
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
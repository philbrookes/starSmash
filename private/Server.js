var Player = require("./Player.js");

Server = function(){
		
}

Server.socket = "8001";

Server.players = new Array();

Server.newConnection = function(sock){
	var player = new Player(sock);
	this.players.push(player);
}

Server.handleInput = function(player, data){
	data = JSON.parse(data);
	switch(data.command){
		case "name":
			if(player.setName(data.name)){
				player.send({"command": "name", "data": {"status": "ok"}});		
				console.log(player.id + " set name to: " + player.name);
			} else {
				player.send({"command": "name", "data": {"status": "fail"}});	
				console.log(player.id + " failed to set name to: '" + data.name + "'");
			}
			player.startGame({"x": 50, "y": 50});
			break;
		case "setResources":
			player.getHq().resources = data.resources;
			break;
		case "build":
			player.build(data.unitType);
			break;
	}
}
module.exports = Server;
var Game = require('./Game.js');
var Server = require('./Server.js');
var ws   = require("nodejs-websocket");

config = {
	"star_style": {
		"width": 3,
		"height": 3,
		"color": "#F7F7F7"
	},
	"tapped_star_style": {
		"width": 3,
		"height": 3,
		"color": "#A7A7A7"
	},
	"ship":{
		"attacker":{
			"cost": 15,
			"maxHp": 25,
			"speed": 15,
			"canMove": true,
			"weapons": [
				{ "damage": 3, "reload": 3000, "range": 50, "color": "#ffff66"}
			],
			"style": {
				"width": 10,
				"height": 10,
				"image": "http://1.bp.blogspot.com/-ZFVNAKdhZEo/Uhue-jFl7nI/AAAAAAAAA3A/iflN3Xh31xY/s1600/RD2.png",
			},
			"gather_radius": 0
		},
		"defender":{
			"cost": 30,
			"maxHp": 50,
			"speed": 3,
			"canMove": true,
			"weapons": [
				{ "damage": 8, "reload": 2500, "range": 75, "color": "#ffff66"}
			],
			"style": {
				"width": 15,
				"height": 15,
				"image": "http://2.bp.blogspot.com/-X35GNyPf_zc/UNHWLXHc6mI/AAAAAAAAARQ/CmWfNetFtU4/s1600/heavyfreighter.png",
			},
			"gather_radius": 0
		},
		"gatherer":{
			"cost": 3,
			"maxHp": 12,
			"speed": 25,
			"canMove": true,
			"weapons": [
				{ "damage": 0.025, "reload": 250, "range": 25, "color": "#ffffcc"}
			],
			"style": {
				"width": 8,
				"height": 8,
				"image": "http://2.bp.blogspot.com/-VrYc5MzBI8Y/Udb8ojt7tbI/AAAAAAAAAvk/oXGrdE-c5Hk/s1600/greenship4.png",
			},
			"gather_radius": 1
		},
		"headquarters":{
			"cost": 5000,
			"maxHp": 1200,
			"speed": 2.5,
			"canMove": true,
			"weapons": [
				{ "damage": 5, "reload": 2500, "range": 100, "color": "#ffff66"},
				{ "damage": .5, "reload": 250, "range": 50, "color": "#ff6666"},
				{ "damage": .25, "reload": 125, "range": 35, "color": "#ffffff"},
			],
			"style": {
				"width": 30,
				"height": 30,
				"image": "http://1.bp.blogspot.com/-MQE-zK1mVSE/UdSVGV3GP3I/AAAAAAAAAu8/EOsv__HnS-M/s1600/spacestation.png",
			},
			"gather_radius": 0
		}
	}
};


var server = ws.createServer(function(sock){
	Server.newConnection(sock);
}).listen(Server.socket);

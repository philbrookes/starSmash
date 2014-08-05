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
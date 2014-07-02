Game = function(){
	this.items = new Array();
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
	}
}
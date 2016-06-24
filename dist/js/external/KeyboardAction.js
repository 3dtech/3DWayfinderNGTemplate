var KeyboardActions = Class.extend({
	init: function(keyboard){
		this.keyboard = keyboard;
	},

	activate: function(key){
		if(typeof this.actions[key.action[0]] === "function"){
			this.actions[key.action[0]](key, this.keyboard);
		}
	},

	addAction: function(key, callback){
		this.actions[key] = callback;
	},

	actions: {
		"backspace" : function (key, keyboard){
			if(keyboard.selectionStart > 0 && keyboard.selectionStart == keyboard.selectionEnd){
				keyboard.selectionStart--;
				keyboard.changeValue("");
			}
			else {
				keyboard.changeValue("");
			}
		},
		"change_keyset" : function (key, keyboard){
			if(key.action[1] !== undefined){
				keyboard.keyset = key.action[1];
				keyboard.clear();
				keyboard.construct();
			}
		},
		"change_layout": function(key, keyboard){
			if(key.action[1] !== undefined){
				keyboard.layoutName = key.action[1];
				keyboard.clear();
				keyboard.construct();
			}
		},
		"submit": function(key, keyboard){
			if(key.action[1] !== undefined){
				keyboard.pushtoOutput();
				keyboard.clear();
			}
		}
	}
});
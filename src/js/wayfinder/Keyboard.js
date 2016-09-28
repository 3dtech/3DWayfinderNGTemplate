var Keyboard = UIComponent.extend({
	init: function(container, defaultLayout){
		this._super(container);
		this.layouts = {};
		this.layoutName = (defaultLayout === undefined ? "en" : defaultLayout);
		this.keyset = "default";
		this.container = container;
		this.selectionStart = 0;
		this.selectionEnd = 0;
		this.output = "";
		this.value = "";
		this.ready_function = null;
		this.actions = new KeyboardActions(this);
		this.cbOnChange = null;
		this.setDefaultLayout();
	},

	addLayout: function(name, layout){
		this.layouts[name] = layout;
	},

	changeLayout: function(name, keyset){
		this.layoutName = name;
		if(keyset){
			this.keyset = keyset;
		}
		else {
			this.keyset = "default";
		}

		this.clear();
		this.construct();
	},

	setOutput: function(output){
		this.output = output;
		var me = this;

		$(this.output).focus(function(){
			me.updateFromOutput();
		});
		$(this.output).keyup(function(){
			me.updateFromOutput();
		});
		$(this.output).mouseup(function(){
			me.updateFromOutput();
		});
		$(this.output).change(function(){
			me.updateFromOutput();
		});
	},

	updateFromOutput: function(){
		if($(this.output).is("input")){
			this.value = $(this.output).val();
		}
		else {
			this.value = $(this.output).text();
		}

		this.getCaretPosition();
	},

	clear: function(){
		this.element.empty();
	},

	clearValue: function(){
		this.value = "";
		this.selectionStart = 0;
		this.selectionEnd = 0;
	},

	getCurrentKeyset: function(){
		try{
			return this.layouts[this.layoutName]["keys"][this.keyset];
		}
		catch(err){
			console.log("Error! Probably no keyboard layout added!");
			return this.layouts["en"]["keys"]["default"];
		}
	},

	construct: function(){
		this.clear();
		var html = "";
		var keyset = this.getCurrentKeyset();
		var c = this.container;
		var me = this;
		for(var r in keyset){
			html += "<div class='keyboard_row'>";
			for(var k in keyset[r]){

				var key = keyset[r][k];
				switch(typeof key){
					case "string":
						html+= "<div class='keyboard_key "+key+"' row='"+r+"' index='"+k+"'>"+key+"</div>";
					break;
					case "object":
						var key_class = "";
						if(key.cls)
							key_class = " "+key.cls;
						html+= "<div class='keyboard_key"+key_class+" "+key.key+"' object='' row='"+r+"' index='"+k+"'>"+key.key+"</div>";
					break;
				}

			}
			html += "</div>";

		}

		this.container.append(html);

		this.container.find(".keyboard_key").mousedown(function(){
			me.getCaretPosition();
			me.keyPressed(this);
		});

		this.container.find(".keyboard_key").mouseup(function(){
			me.keyReleased(this);
		});

		$(this.container).find(".keyboard_key").mouseout(function(){
			me.keyReleased(this);
		});

		///remove text selection
		if(this.container[0] !== undefined){
			this.container[0].onselectstart = function() {return false;}; // ie
			this.container[0].onmousedown = function() {return false;}; // mozilla (this disables the search box)
		}

		this.rescale();
	},

	rescale: function(){
		var keyboard_height = 0;
		var keyboard_width = 0;

		this.container.find(".keyboard_row").each(function(){
			var key_height = $(this).outerHeight()-$(this).innerHeight();
			var row_width = $(this).outerWidth()-$(this).innerWidth();

			$(this).children().each(function(){
				var width = 0;
				//this is a hack for the
				if($(this).outerWidth() < $(this).outerWidth(true))
					width = $(this).outerWidth(true);
				else
					width = $(this).outerWidth() + $(this).outerWidth(true);

				row_width += width+1;
				key_height = Math.max(key_height, $(this).outerHeight(true));
			});

			///setting row dimensions
			$(this).width(row_width);
			$(this).height(key_height);

			///setting keyboard dimensions
			keyboard_height += key_height;
		});
		this.container.height(keyboard_height);
		//$(this.container).width(keyboard_width);

		//lets announce that the keyboard is ready to draw
		if(this.ready_function !== null){
			this.ready_function();
		}
	},

	keyPressed: function(key){
		$(key).addClass("key_pressed");
		var layout = this.getCurrentKeyset();

		var lkey = layout[$(key).attr("row")][$(key).attr("index")];
		switch(typeof lkey){
			case "string":
				this.changeValue(lkey);
			break;
			case "object":
				if(lkey.action === undefined){
					this.changeValue(lkey.key);
				}
				else {
					this.actions.activate(lkey);
				}
			break;
		}
		this.pushtoOutput();
	},

	changeValue: function(char){
		var start = this.value.substring(0, this.selectionStart);
		var end = this.value.substring(this.selectionEnd, this.value.length);
		this.value = "" + start + char + end;
		this.selectionStart += char.length;
		this.selectionEnd = this.selectionStart;
	},

	pushtoOutput: function(){
		if(this.output){
			if(this.output.is("input")){
				this.output.val("input");
				this.output.val(this.value);
				this.output[0].selectionStart = this.selectionStart;
				this.output[0].selectionEnd = this.selectionEnd;
			}
			else {
				this.output.html(this.value);
			}

			//let the output know that value as changed
			this.output.trigger("change");
			this.output.trigger("keyup");
			this.output.trigger("");

			if(this.cbOnChange && typeof this.cbOnChange === "function"){
				this.cbOnChange(this.value);
			}

		}
	},

	getCaretPosition: function(){
		if(this.output !== undefined){
			if($(this.output).is("input")){
				this.selectionStart = $(this.output)[0].selectionStart;
				this.selectionEnd = $(this.output)[0].selectionEnd;
			}
		}
	},

	keyReleased: function(key){
		$(key).removeClass("key_pressed");
	},

	width: function(){
		return $(this.container).outerWidth();
	},

	height: function(){
		return $(this.container).outerHeight();
	},

	ready: function(ready_function){
		this.ready_function = ready_function;
	},

	setDefaultLayout: function(){
		this.layouts["en"] = {
			'name': "English",
			'keyboard':"US International",
			'local_name': "English",
			'lang': "en",
			'keys': {
				"default": [
					["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {'key': "&#171; Bksp", 'action': ["backspace"], 'cls': "key2x"}],
					["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\\"],
					["a", "s", "d", "f", "g", "h", "j", "k", "l", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x"}, "z", "x", "c", "v", "b", "n", "m"],
					[{"key": " ", "cls": "key_spacebar"}]
					],
				"shift": [
					["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", {'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x"}],
					["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}"],
					["A", "S", "D", "F", "G", "H", "J", "K", "L", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x active"}, "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
					[{"key": " ", "cls": "key_spacebar"}]
					],
			}
		};
	}
});
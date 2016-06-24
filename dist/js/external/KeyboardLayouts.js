KeyboardLayouts = Class.extend({
	init: function(){
		this.layouts = {};
		this.setDefaultLayout();
	},

	get: function(name){
		return this.layout[name];
	},

	add: function(name, _layout) {
		this.layouts[name] = _layout.get(name);
	},

	setDefaultLayout: function(){
		this.layouts["en"] = {
			'name': "English",
			'keyboard':"US International",
			'local_name': "English",
			'lang': "en",
			'keys': {
				"default": [
					["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", {'key': "&#171; Bksp", 'action': ["backspace"], 'cls': "key2x"}],
					[{'key': "Tab", 'action': ["tab"], 'cls': "key2x"}, "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
					[{'key': "Caps", 'action': ["change_keyset", "capslck"], 'cls': "key2x"}, "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x"}, "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", {'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x"}],
					[{'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}, {"key": " ", "cls": "key_spacebar"}, {'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}]
					],
				"capslck": [
					["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", {'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x"}],
					[{'key': "Tab", 'action': ["tab"], 'cls': "key2x"}, "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
					[{'key': "Caps", 'action': ["change_keyset", "default"], 'cls': "key2x active"}, "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x"}, "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", {'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x"}],
					[{'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}, {"key": " ", "cls": "key_spacebar"}, {'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}]
					],
				"shift": [
					["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", {'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x"}],
					[{'key': "Tab", 'action': ["tab"], 'cls': "key2x"}, "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
					[{'key': "Caps", 'action': ["change_keyset", "capslck"], 'cls': "key2x"}, "A", "S", "D", "F", "G", "H", "J", "K", "L",":", "\"", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x active"}, "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", {'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x active"}],
					[{'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}, {"key": " ", "cls": "key_spacebar"}, {'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x"}]
					],
				"altgr": [
					["", "\u00b9", "\u00b2", "\u00b3", "\u00a4", "\u20ac", "\u00bc", "\u00bd", "\u00be", "\u2018", "\u2019", "\u00a5", "\u00d7", {'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x"}],
					[{'key': "Tab", 'action': ["tab"], 'cls': "key2x"}, "\u00e4", "\u00e5", "\u00e9", "\u00ae", "\u00fe", "\u00fc", "\u00fa", "\u00ed", "\u00f3", "\u00f6", "\u00ab", "\u00bb", "\u00ac"],
					[{'key': "Caps", 'action': ["change_keyset", "default"], 'cls': "key2x"}, "\u00e1", "\u00df", "\u00f0", "", "", "", "", "", "\u00f8", "\u00b6", "\u00b4", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "altgr_shift"], 'cls': "key2x"}, "\u00e6", "", "\u00a9", "", "", "\u00f1", "\u00b5", "\u00e7", "", "\u00bf", {'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x"}],
					[{'key': "AltCr", 'action': ["change_keyset", "default"], 'cls': "key2x active"}, {"key": " ", "cls": "key_spacebar"}, {'key': "AltCr", 'action': ["change_keyset", "default"], 'cls': "key2x active"}]
					],
				"altgr_shift": [
					["", "\u00a1", "", "", "\u00a3", "", "", "", "", "", "", "", "\u00f7", {'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x"}],
					[{'key': "Tab", 'action': ["tab"], 'cls': "key2x"}, "\u00c4", "\u00c5", "\u00c9", "", "\u00de", "\u00dc", "\u00da", "\u00cd", "\u00d3", "\u00d6", "", "", "\u00a6"],
					[{'key': "Caps", 'action': ["change_keyset", "default"], 'cls': "key2x"}, "\u00c1", "\u00a7", "\u00d0", "", "", "", "", "", "\u00d8", "\u00b0", "\u00a8", {'key': "Enter", 'action': ["submit"], 'cls': "key3x"}],
					[{'key': "Shift", 'action': ["change_keyset", "altgr"], 'cls': "key2x active"}, "\u00c6", "", "\u00a2", "", "", "\u00d1", "", "\u00c7", "", "", {'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x active"}],
					[{'key': "AltCr", 'action': ["change_keyset", "default"], 'cls': "key2x active"}, {"key": " ", "cls": "key_spacebar"}, {'key': "AltCr", 'action': ["change_keyset", "altgr"], 'cls': "key2x active"}]
					]
			}
		};
	}
});
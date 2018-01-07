wfApp.factory('keyboardService', ['$rootScope', function($scope) {
	var kbLayoutEt = {
		"name": "Estonian",
		"local_name": "Eesti",
		"lang": "et",
		"keys": {
			"default": [
				["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
					"key": "&#171; Bksp",
					"action": ["backspace"],
					"cls": "key2x"
				}],
				["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ü", "õ"],
				["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", {
					"key": "Enter",
					"action": ["submit"],
					"cls": "key3x"
				}],
				["z", "x", "c", "v", "b", "n", "m", ".", "_", "-", "@"],
				[{
					"key": " ",
					"cls": "key_spacebar"
				}]
			]
		}
	};

	var kbLayoutRu = {
		"name": "Russian",
		"local_name": "%C3%90%20%C3%91%C6%92%C3%91%C2%81%C3%91%C2%81%C3%90%C2%BA%C3%90%C2%B8%C3%90%C2%B9",
		"lang": "ru",
		"keys": {
			"default": [
				[{
					"key": "en",
					"action": ["change_keyset", "en"],
					"cls": "change_layout"
				}, "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
					"key": "&#171; Bksp",
					"action": ["backspace"],
					"cls": "key2x"
				}],
				["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\"],
				["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", {
					"key": "Enter",
					"action": ["submit"],
					"cls": "key3x"
				}],
				["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "_", "-", "@"],
				[{
					"key": " ",
					"cls": "key_spacebar"
				}]
			],
			"en": [
				[{
					"key": "ru",
					"action": ["change_keyset", "default"],
					"cls": "change_layout"
				}, "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
					"key": "&#171; Bksp",
					"action": ["backspace"],
					"cls": "key2x"
				}],
				["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\\"],
				["a", "s", "d", "f", "g", "h", "j", "k", "l", {
					"key": "Enter",
					"action": ["submit"],
					"cls": "key3x"
				}],
				["z", "x", "c", "v", "b", "n", "m", ".", "_", "-", "@"],
				[{
					"key": " ",
					"cls": "key_spacebar"
				}]
			]
		}
	};

	var kbLayoutEn = {
		"name": "English",
		"keyboard": "US International",
		"local_name": "English",
		"lang": "en",
		"keys": {
			"default": [
				["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
					"key": "&#171; Bksp",
					"action": ["backspace"],
					"cls": "key2x"
				}],
				["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
				["a", "s", "d", "f", "g", "h", "j", "k", "l", {
					"key": "Enter",
					"action": ["submit"],
					"cls": "key3x"
				}],
				["z", "x", "c", "v", "b", "n", "m", ".", "_", "-", "@"],
				[{
					"key": " ",
					"cls": "key_spacebar"
				}]
			],
			"shift": [
				["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", {
					"key": "&#171; Bksp",
					"action": "backspace",
					"cls": "key2x"
				}],
				["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
				["A", "S", "D", "F", "G", "H", "J", "K", "L", {
					"key": "Enter",
					"action": ["submit"],
					"cls": "key3x"
				}],
				[{
					"key": "Shift",
					"action": ["change_keyset", "default"],
					"cls": "key2x active"
				}, "Z", "X", "C", "V", "B", "N", "M", ".", "_", "-", "@"],
				[{
					"key": " ",
					"cls": "key_spacebar"
				}]
			]
		}
	};

	var kbLayouts = [];

	kbLayouts.push(kbLayoutEt);
	kbLayouts.push(kbLayoutEn);
	kbLayouts.push(kbLayoutRu);

	return {
		getLayouts: function() {
			return kbLayouts;
		}
	};
}]);

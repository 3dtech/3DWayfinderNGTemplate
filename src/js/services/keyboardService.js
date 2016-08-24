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
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\u00FC", "\u00F5"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l", "\u00F6", "\u00E4", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ]
      }
    };

    var kbLayoutRu = {
      "name": "Russian",
      "local_name": "Ð ÑƒÑÑÐºÐ¸Ð¹",
      "lang": "ru",
      "keys": {
        "default": [
          [{
            "key": "en",
            "action": ["change_keyset", "en"],
            "cls": "change_layout"
          }, "\u0451", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
            "key": "&#171; Bksp",
            "action": ["backspace"],
            "cls": "key2x"
          }],
          ["\u0439", "\u0446", "\u0443", "\u043A", "\u0435", "\u043D", "\u0433", "\u0448", "\u0449", "\u0437", "\u0445", "\u044A", "\\"],
          ["\u0444", "\u044B", "\u0432", "\u0430", "\u043F", "\u0440", "\u043E", "\u043B", "\u0434", "\u0436", "\u044D", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["\u044F", "\u0447", "\u0441", "\u043C", "\u0438", "\u0442", "\u044C", "\u0431", "\u044E", "\u002E", "\u005F", "\u002D", "\u0040"],
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
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
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
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
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
          }, "Z", "X", "C", "V", "B", "N", "M", "\u002E", "\u005F", "\u002D", "\u0040"],
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

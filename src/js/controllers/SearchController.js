//var groupsModule = angular.module('wf.groups', ['wfangular']);

wfApp.controller('SearchController', [
	'$rootScope',
	'$scope',
	'$routeParams',
	'$timeout',
	'wfService',
	'keyboardService',
	'wfangular',
	function ($rootScope, $scope, $routeParams, $timeout, wfService, keyboardService,
			  wayfinder) {
		var kbLayouts = [];
		var searchKeyboard = {};
		$scope.noResults = false;
		searchKeyboard.handle = '.search-keyboard';
		searchKeyboard.target = '#search-bar';
		$scope.textToSearch = "";
		$scope.kioskMode = true;
		$scope.showKeyboard = $scope.kioskMode;

		$scope.poiObjects = [];

		$scope.getLanguage = function () {
			return wayfinder.getLanguage();
		};
		$scope.onViewLoad = function () {
			dragscroll.reset();
		};
		var kbLayoutEt = {
			"name": "Estonian",
			"local_name": "Eesti",
			"lang": "et",
			"keys": {
				"default": [
					[ "1", "2", "3", "4", "5", "6", "7", "8",
						"9", "0", {
						"key": "&#171; Bksp",
						"action": [ "backspace" ],
						"cls": "key2x"
					}
					],
					[ "q", "w", "e", "r", "t", "y", "u", "i",
						"o", "p", "\u00FC", "\u00F5"
					],
					[ "a", "s", "d", "f", "g", "h", "j", "k",
						"l", "\u00F6", "\u00E4", {
						"key": "Enter",
						"action": [ "submit" ],
						"cls": "key3x"
					}
					],
					[ "z", "x", "c", "v", "b", "n", "m",
						"\u002E", "\u005F", "\u002D", "\u0040"
					],
					[ {
						"key": " ",
						"cls": "key_spacebar"
					} ]
				]
			}
		};
		var kbLayoutRu = {
			"name": "Russian",
			"local_name": "Ð ÑƒÑÑÐºÐ¸Ð¹",
			"lang": "ru",
			"keys": {
				"default": [
					[ {
						"key": "en",
						"action": [ "change_keyset", "en" ],
						"cls": "change_layout"
					}, "\u0451", "1", "2", "3", "4", "5",
						"6", "7", "8", "9", "0", {
						"key": "&#171; Bksp",
						"action": [ "backspace" ],
						"cls": "key2x"
					}
					],
					[ "\u0439", "\u0446", "\u0443", "\u043A",
						"\u0435", "\u043D", "\u0433", "\u0448",
						"\u0449", "\u0437", "\u0445", "\u044A",
						"\\"
					],
					[ "\u0444", "\u044B", "\u0432", "\u0430",
						"\u043F", "\u0440", "\u043E", "\u043B",
						"\u0434", "\u0436", "\u044D", {
						"key": "Enter",
						"action": [ "submit" ],
						"cls": "key3x"
					}
					],
					[ "\u044F", "\u0447", "\u0441", "\u043C",
						"\u0438", "\u0442", "\u044C", "\u0431",
						"\u044E", "\u002E", "\u005F", "\u002D",
						"\u0040"
					],
					[ {
						"key": " ",
						"cls": "key_spacebar"
					} ]
				],
				"en": [
					[ {
						"key": "ru",
						"action": [ "change_keyset",
							"default"
						],
						"cls": "change_layout"
					}, "1", "2", "3", "4", "5", "6", "7",
						"8", "9", "0", {
						"key": "&#171; Bksp",
						"action": [ "backspace" ],
						"cls": "key2x"
					}
					],
					[ "q", "w", "e", "r", "t", "y", "u", "i",
						"o", "p", "\\"
					],
					[ "a", "s", "d", "f", "g", "h", "j", "k",
						"l", {
						"key": "Enter",
						"action": [ "submit" ],
						"cls": "key3x"
					}
					],
					[ "z", "x", "c", "v", "b", "n", "m",
						"\u002E", "\u005F", "\u002D", "\u0040"
					],
					[ {
						"key": " ",
						"cls": "key_spacebar"
					} ]
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
					[ "1", "2", "3", "4", "5", "6", "7", "8",
						"9", "0", {
						"key": "&#171; Bksp",
						"action": [ "backspace" ],
						"cls": "key2x"
					}
					],
					[ "q", "w", "e", "r", "t", "y", "u", "i",
						"o", "p"
					],
					[ "a", "s", "d", "f", "g", "h", "j", "k",
						"l", {
						"key": "Enter",
						"action": [ "submit" ],
						"cls": "key3x"
					}
					],
					[ "z", "x", "c", "v", "b", "n", "m",
						"\u002E", "\u005F", "\u002D", "\u0040"
					],
					[ {
						"key": " ",
						"cls": "key_spacebar"
					} ]
				],
				"shift": [
					[ "!", "@", "#", "$", "%", "^", "&", "*",
						"(", ")", "_", "+", {
						"key": "&#171; Bksp",
						"action": "backspace",
						"cls": "key2x"
					}
					],
					[ "Q", "W", "E", "R", "T", "Y", "U", "I",
						"O", "P"
					],
					[ "A", "S", "D", "F", "G", "H", "J", "K",
						"L", {
						"key": "Enter",
						"action": [ "submit" ],
						"cls": "key3x"
					}
					],
					[ {
						"key": "Shift",
						"action": [ "change_keyset",
							"default"
						],
						"cls": "key2x active"
					}, "Z", "X", "C", "V", "B", "N", "M",
						"\u002E", "\u005F", "\u002D", "\u0040"
					],
					[ {
						"key": " ",
						"cls": "key_spacebar"
					} ]
				]
			}
		};


		function sendStatistics(string) {
			if ($scope.poiObjects.length === 0) {
				wayfinder.statistics.onSearch(string, "unsuccessful");
			} else {
				wayfinder.statistics.onSearch(string, "successful");
			}
		}

		function setupKeyboard(input, output, statistics) {
			var keyboard = new Keyboard($(input), wayfinder.getLanguage());
			keyboard.addLayout('et', kbLayoutEt);
			keyboard.addLayout('ru', kbLayoutRu);
			keyboard.addLayout('en', kbLayoutEn);
			keyboard.setOutput($(output));
			keyboard.cbOnChange = function (val) {
				$(input)
					.trigger("keypressed");
				$rootScope.$broadcast("wf.keyboard.change", val);
				$timeout(function () {
					//console.log( "wf.keyboard.change:",
					//	$scope.filtered );
					if (statistics) sendStatistics(val);
				}, 300);
			};
			$rootScope.$on("wf.language.change", function (event,
														   language) {
				keyboard.changeLayout(language);
			});
			keyboard.construct();
			keyboard.show();
			return keyboard;
		}

		var searchKeyboard = setupKeyboard(".search-keyboard",
			"#search-bar", true);

		function createKeyboard(keyboard, layouts) {
			var newKeyboard = new Keyboard($(keyboard.handle),
				$scope.getLanguage());

			for (var i in layouts)
				newKeyboard.addLayout(layouts[i].lang, layouts[i]);

			newKeyboard.setOutput($(keyboard.target));

			newKeyboard.cbOnChange = function (val) {
				wfService.searchFilter(val);
			};

			newKeyboard.construct();
			newKeyboard.show();
			return newKeyboard;
		}

		/*$scope.getColorRGBA = function(group) {
		 //Function to convert hex format to a rgb textColor
		 if (!group) return;
		 var rgb = group.getColor();
		 var r = rgb["r"];
		 var g = rgb["g"];
		 var b = rgb["b"];
		 var a = rgb["a"];
		 var textColor = "rgba(" + parseInt(r.toString(10) * 255) + "," + parseInt(g.toString(10) * 255) + "," + parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(10) * 255) + ")";
		 return textColor;
		 };*/


		// scope.watch(scope param to watch, function (new value, old value) {}
		$scope.$watch('textToSearch', function (data, last) {
			if (!data) {
				$scope.poiObjects = [];
				$scope.noResults = false;
				return;
			}
			//console.debug( "filtered poiObjects:", data );
			$timeout(function () {
				//console.debug( "filtered:", $scope.filtered.length );
				if ($scope.poiObjects && $scope.poiObjects.length != 0 && data.length > 1) {
					if (wayfinder.search.search(data).length == 0) {
						$scope.noResults = true;
					} else {
						$scope.noResults = false;
					}
					$scope.poiObjects = wayfinder.search.search(data);
					wayfinder.statistics.onSearch(data, "successful");
					console.debug("search.successful:", data)
				}
				else if (data.length > 1) {
					if (wayfinder.search.search(data).length == 0) {
						$scope.noResults = true;
					} else {
						$scope.noResults = false;
					}
					$scope.poiObjects = wayfinder.search.search(data);
					wayfinder.statistics.onSearch(data, "unsuccessful");
					console.debug("search.unsuccessful");
				}
			}, 20);

		});

		function checkRouteParams() {
			if (!$routeParams) return;

			$rootScope.$broadcast("wf.nav-menu", "show");
		}

		/*$scope.$watch( 'searchText', function ( val ) {
		 if ( tempFilterText == val ) return;
		 console.log( "SearchController.searchText.changed:",
		 val );
		 if ( filterTextTimeout ) $timeout.cancel(
		 filterTextTimeout );

		 tempFilterText = val;
		 filterTextTimeout = $timeout( function () {
		 $scope.filterText.names.translations[
		 $scope.getLanguage() ] =
		 tempFilterText;
		 }, 10 ); // delay 250 ms
		 } ); */
		/*
		 $rootScope.$on("wf.search-text.change", function(event, val) {
		 console.log("search-event:", val);
		 $scope.searchText = val;
		 if (filterTextTimeout) $timeout.cancel(
		 filterTextTimeout);

		 tempFilterText = val;
		 filterTextTimeout = $timeout(function() {
		 $scope.filterText.names.translations[
		 wayfinder.getLanguage()] =
		 tempFilterText;
		 }, 10); // delay 250 ms
		 });
		 */


		$scope.$on("wf.map.ready", function (event) {

			checkRouteParams();
		});

		$timeout(function () {
			checkRouteParams();
		}, 10);

		$timeout(function () {
			kbLayouts = keyboardService.getLayouts();
			searchKeyboard.keyboard = createKeyboard(
				searchKeyboard,
				kbLayouts);

			// console.log("SearchController.data.loaded");
		}, 20);

		//$rootScope.$emit("search.init", $scope);

		$rootScope.$on("wf.language.change", function (event, language) {
			if (searchKeyboard.keyboard)
				searchKeyboard.keyboard.changeLayout(language);
		});

		$rootScope.$on("app.reset", function (event) {
			//console.log("app.reset");
			$scope.textToSearch = "";
			$scope.showKeyboard = false;
		});

		$scope.show = function () {
			//console.log("app.hide.info");
			$scope.showKeyboard = !$scope.showKeyboard;
			$rootScope.$broadcast("app.hide.info");
		};


		$rootScope.$on("app.hide.keyboard", function (event, language) {
			//console.log("app.hide.keyboard");
			$scope.showKeyboard = false;
		});

		$rootScope.$on("app.reset", function (event, language) {
			//console.log("app.reset");
			$scope.showKeyboard = false;
			wfService.clearFilter();
		});

		$rootScope.$on("wf.touch", function (event, language) {
			//console.log("wf.touch");
			$scope.showKeyboard = false;
		});
	}
]);

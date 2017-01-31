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
		searchKeyboard.handle = '.search-keyboard';
		searchKeyboard.target = '#search-bar';
		$scope.textToSearch = "";
		$scope.showKeyboard = false;

		$scope.poiObjects = wfService.getPOIs();

		$scope.getLanguage = function () {
			return wayfinder.getLanguage();
		};

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
				$scope.poiObjects = wfService.getPOIs();
			}
			//console.debug( "filtered poiObjects:", data );
			$timeout(function () {
				//console.debug( "filtered:", $scope.filtered.length );
				if ($scope.poiObjects && $scope.poiObjects.length != 0 && data.length > 1) {
					$scope.poiObjects = wayfinder.search.searchString(data);
					wayfinder.statistics.onSearch(data, "successful");
					console.debug("search.successful:", data)
				}
				else if (data.length > 1) {
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
			$scope.poiObjects = wfService.data.pois;
			// console.log("SearchController.data.loaded");
		}, 20);

		//$rootScope.$emit("search.init", $scope);

		$rootScope.$on("wf.language.change", function (event, language) {
			if (searchKeyboard.keyboard)
				searchKeyboard.keyboard.changeLayout(language);
		});

		$rootScope.$on("app.reset", function (event) {
			$scope.textToSearch = "";
			$scope.showKeyboard = false;
		});

		$scope.show = function () {
			$scope.showKeyboard = !$scope.showKeyboard;
			$rootScope.$broadcast("app.hide.info");
		};

		$rootScope.$on("app.hide.keyboard", function (event, language) {
			$scope.showKeyboard = false;
		});

		$rootScope.$on("app.reset", function (event, language) {
			$scope.showKeyboard = false;
			wfService.clearFilter();
		});

		$rootScope.$on("wf.touch", function (event, language) {
			$scope.showKeyboard = false;
		});
	}
]);

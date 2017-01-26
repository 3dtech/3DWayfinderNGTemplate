//var groupsModule = angular.module('wf.groups', ['wfangular']);

wfApp.controller('SearchController', [
    '$rootScope',
    '$scope',
	'$routeParams',
    '$timeout',
    'wfService',
    'keyboardService',
    'wfangular',
    function($rootScope, $scope, $routeParams, $timeout, wfService, keyboardService,
        wayfinder) {
        var kbLayouts = [];
        var searchKeyboard = {};
        searchKeyboard.handle = '.search-keyboard';
        searchKeyboard.target = '#search-bar';
        $scope.textToSearch = "";
        $scope.showKeyboard = true;

        $scope.poiObjects = wfService.data.pois;

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
            $rootScope.$broadcast("wf.nav-menu", "hide");
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.searchPOIsNames = function(poi) {
            if (!!poi && !!poi.getName(wayfinder.getLanguage())) {
                return poi.getName($scope.getLanguage())
                    .toLowerCase().match($scope.textToSearch.toLowerCase());
            }
        };

        /*        $scope.searchText = "";

         $scope.filterText = {};
         $scope.filterText.names = {};
         $scope.filterText.names.translations = {};
         $scope.filterText.names.translations[ $scope.getLanguage() ] =
         "";

         // Instantiate these variables outside the watch
         var tempFilterText = '',
         filterTextTimeout;
         */
        function createKeyboard(keyboard, layouts) {
            var newKeyboard = new Keyboard($(keyboard.handle),
                $scope.getLanguage());
            // console.debug("createKeyboard.newKeyboard:", newKeyboard);

            for (var i in layouts)
                newKeyboard.addLayout(layouts[i].lang, layouts[i]);

            newKeyboard.setOutput($(keyboard.target));

            newKeyboard.cbOnChange = function(val) {
                console.log("me:", val);
                $(keyboard.handle).trigger("keypressed");
                $rootScope.$broadcast("wf.keyboard.change", val);
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

        $scope.$watch('textToSearch', function(data) {
            if (!data) return;
            //console.debug( "filtered poiObjects:", data );
            $timeout(function() {
                //console.debug( "filtered:", $scope.filtered.length );
                if ($scope.filtered.length != 0 && data.length > 1) {
                    wayfinder.statistics.onSearch(data,
                        "successful");
                    // console.debug("search.successful")
                }
                else if (data.length > 1) {
                    wayfinder.statistics.onSearch(data,
                        "unsuccessful");
                    // console.debug("search.unsuccessful");
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

        $rootScope.$on("wf.language.change", function(event,
            language) {
            // console.log("searchKeyboard:", searchKeyboard);
            if (searchKeyboard.keyboard)
                searchKeyboard.keyboard.changeLayout(language);
        });

		$scope.$on("wf.map.ready", function(event) {

			checkRouteParams();
		});

		$timeout(function () {
			checkRouteParams();
		}, 10);

        $timeout(function() {
            kbLayouts = keyboardService.getLayouts();
            searchKeyboard.keyboard = createKeyboard(
                searchKeyboard,
                kbLayouts);
            $scope.poiObjects = wfService.data.pois;
            // console.log("SearchController.data.loaded");
        }, 20);

        //$rootScope.$emit("search.init", $scope);

    }
]);

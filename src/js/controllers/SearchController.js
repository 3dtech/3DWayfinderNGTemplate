//var groupsModule = angular.module('wf.groups', ['wfangular']);

wayfinderApp.controller('SearchController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wayfinderService',
    'keyboardService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, wayfinderService, keyboardService, wayfinder) {
        var kbLayouts = [];
        var searchKeyboard = {};
        searchKeyboard.handle = '.search-keyboard';
        searchKeyboard.target = '#search-bar';

        $scope.searchText = "";

        $scope.poiObjects = [];

        $scope.filterText = {};
        $scope.filterText.names = {};
        $scope.filterText.names.translations = {};
        $scope.filterText.names.translations[wayfinder.getLanguage()] =
            "";

        // Instantiate these variables outside the watch
        var tempFilterText = '',
            filterTextTimeout;

        function createKeyboard(keyboard, layouts) {
            var newKeyboard = new Keyboard($(keyboard.handle),
                wayfinder.getLanguage());

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

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.getColorRGBA = function(group) {
            //Function to convert hex format to a rgb textColor
            if (!group) return;
            var rgb = group.getColor();
            var r = rgb["r"];
            var g = rgb["g"];
            var b = rgb["b"];
            var a = rgb["a"];
            var textColor = "rgba(" + parseInt(r.toString(10) * 255) + "," + parseInt(g.toString(10) * 255) + "," + parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(10) * 255) + ")";
            return textColor;
        };

        $scope.$watch('searchText', function(val) {
            console.log("SearchController.searchText.changed:",
                val);
            if (filterTextTimeout) $timeout.cancel(
                filterTextTimeout);

            tempFilterText = val;
            filterTextTimeout = $timeout(function() {
                $scope.filterText.names.translations[
                        wayfinder.getLanguage()] =
                    tempFilterText;
            }, 250); // delay 250 ms
        });

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

        $rootScope.$on("wf.language.change", function(event, language) {
            console.log("searchKeyboard:", searchKeyboard);
            if (searchKeyboard.keyboard)
                searchKeyboard.changeLayout(language);
        });

        $timeout(function() {
            kbLayouts = keyboardService.getLayouts();
            searchKeyboard.keyboard = createKeyboard(
                searchKeyboard,
                kbLayouts);
            $scope.poiObjects = wayfinderService.getPOIs();
            console.log("SearchController.data.loaded");
        }, 20);
    }
]);

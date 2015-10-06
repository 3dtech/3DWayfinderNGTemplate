// Declare app level module which depends on filters, and services
var wayfinderApp = angular.module('app', [
    'ngRoute',
    'wfangular',
    'wf.languages',
    'wf.floors',
    'wf.zoom' // all modules go here, and into separate files and into the folder modules/<modulename>
]);

wayfinderApp.run(['wfangular3d', function(wayfinder) {
    WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
    wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
    wayfinder.open("05d899e005f24a45a7b17b7d500a24d8");
}]);


wayfinderApp.controller('WayfinderCtrl', ['$scope', 'wfangular3d', function($scope, wayfinder) {
    $scope.cbResize = function() {
        console.log("callback!");
        wayfinder.resize();
    }
}]);

wayfinderApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

wayfinderApp.filter('reverseArrayOnly', function() {7
    return function(items) {
        console.log(typeof items);
        if (!angular.isArray(items)) {
            return items;
        }
        return items.slice().reverse();
    };
});

wayfinderApp.directive('resizeDir', function($window) {
    return {
        restrict: 'AEC',
        link: function(scope, element, attrs) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };

            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function() {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };

            }, true);

            w.bind('resizeDir', function() {
                scope.$apply(function() {
                    console.log("calling wayfinder next!");
                    wayfinder.resize();
                });
            });
        }
    }
});

var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.languages = {};

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        }

        $scope.getLanguages = function() {
            return wayfinder.getLanguages();
        }

        $scope.setLanguage = function(language) {
            wayfinder.setLanguage(language);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                $scope.languages = wayfinder.getLanguages();
            });
        });
    }
]);


var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.buildingFloors = [];
        $scope.activeFloor = {};
        $scope.kioskNode = {};
        $scope.activeLanguage = {};
        
        $scope.floorsOrdered = function() {
            var orderedFloors = [];
            for (var i = $scope.buildingFloors.length - 1; i >= 0; i--) {
                orderedFloors.push($scope.buildingFloors[i]);
            };
            return orderedFloors;
        }

        $scope.$watch(
            function() {
                return wayfinder.getLanguage()
            },
            function(newValue, oldValue) {
                $scope.activeLanguage = wayfinder.getLanguage();
                console.log("watch.getLanguage(" + wayfinder.getLanguage() + ")");
            });

        $scope.getFloor = function() {
            $scope.kioskNode = wayfinder.getKioskNode();
            console.log("getKioskNode=" + $scope.kioskNode);
            console.log("floorActiveLanguage:" + $scope.activeLanguage);
        }

        $scope.setActiveFloor = function(floor) {
            $scope.activeFloor = floor;
        }

        $scope.getActiveFloor = function() {
            return $scope.activeFloor;
        }

        $scope.setFloor = function(floor) {
            $scope.activeFloor = floor;
            wayfinder.showFloor(floor);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                $scope.activeLanguage = wayfinder.getLanguage();
                $scope.kioskNode = wayfinder.getKioskNode();
                var arr = [];
                for (var key in wayfinder.building.getFloors()) {
                    // add hasOwnPropertyCheck if needed
                    arr.push(wayfinder.building.getFloors()[key]);
                  }
                for (var i = arr.length - 1; i >= 0; i--) {
                    $scope.buildingFloors.push(arr[i]);
                };
                console.log("buildingFloors:", $scope.buildingFloors);
            });
        });
    }
]);

var zoomModule = angular.module('wf.zoom', ['wfangular']);

zoomModule.controller('ZoomCtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.zoomIn = function() {
            wayfinder.zoomIn();
            console.log("zoomIn()");
        }

        $scope.zoomOut = function() {
            wayfinder.zoomOut();
            console.log("zoomOut()");
        }
    }
]);

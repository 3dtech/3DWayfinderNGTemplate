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

wayfinderApp.filter('reverseArrayOnly', function() {
    return function(items) {
        if (!angular.isArray(items)) {
            return items;
        }
        return items.slice().reverse();
    };
});

wayfinderApp.directive('resizeDir', ['$compile', 'wfangular3d', function($window, $compile, wayfinder) {
    return {
        restrict: 'C',
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
}]);

var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
    '$scope',
    'wfangular3d',
    'FloorSrv',
    'LanguagesSrv',
    function($scope, wayfinder, FloorSrv, LanguagesSrv) {
        $scope.buildingFloors = {};
        $scope.activeFloor = {};
        $scope.kioskNode = {};
        $scope.activeLanguage = {};

        $scope.$watch(
            function() {
                return LanguagesSrv.getLanguage()
            },
            function(newValue, oldValue) {
                $scope.activeLanguage = FloorSrv.getLanguage();
                console.log("watch.getLanguage(" + FloorSrv.getLanguage() + ")");
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
                $scope.activeLanguage = FloorSrv.getLanguage();
                $scope.kioskNode = wayfinder.getKioskNode();
                $scope.buildingFloors = wayfinder.building.getFloors();
            });
        });
    }
]);

floorsModule.service('FloorSrv', function(LanguagesSrv) {
    this.getLanguage = function() {
        return LanguagesSrv.getLanguage();
    }
});

var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
    '$scope',
    'wfangular3d',
    'LanguagesSrv',
    function($scope, wayfinder, LanguagesSrv) {
        $scope.languages = {};
        $scope.activeLanguage = {};

        $scope.getLanguage = function() {
            return LanguagesSrv.getLanguage();
        }

        $scope.getLanguages = function() {
            return LanguagesSrv.getLanguages();
        }

        $scope.setLanguage = function(language) {
            console.log("setLanguage(" + language + ")");
            $scope.activeLanguage = language;
            LanguagesSrv.setLanguage(language);
            wayfinder.setLanguage(language);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                LanguagesSrv.setLanguages(wayfinder.getLanguages());
                LanguagesSrv.setLanguage(wayfinder.getLanguage());
                $scope.languages = LanguagesSrv.getLanguages();
                $scope.activeLanguage = LanguagesSrv.getLanguage();
            });
        });
    }
]);

languagesModule.service('LanguagesSrv', function() {
    var activeLanguage = {};
    var wfLanguages = {};

    return {
        getLanguage: function() {
            return activeLanguage;
        },
        setLanguage: function(language) {
            activeLanguage = language;
        },
        getLanguages: function() {
            return wfLanguages;
        },
        setLanguages: function(languages) {
            wfLanguages = languages;
        }
    }
});


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

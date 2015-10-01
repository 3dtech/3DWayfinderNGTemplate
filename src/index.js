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

// Declare app level module which depends on filters, and services
var wfApp = angular.module('wfApp', [
    'ngSanitize',
    /*'ngAnimate',*/
    'ngRoute',
    'wfangular'
    /*,
     'wf.languages',
     'wf.floors',
     'wf.groups'*/
    /*,
     'wf.keyboard',
     'wf.tabs',
     'wf.zoom' */ // all modules go here, and into separate files and into the folder modules/<modulename>
]);

wfApp.run(['wfangular3d', '$rootScope', '$http', '$route', '$location', function (wayfinder, $rootScope, $http, $route, $location) {
    $route.reload();
    if ($location.host().match("localhost") && $location.port() == 8080) {
        WayfinderAPI.LOCATION = "//api.3dwayfinder.com/";
        wayfinder.options.apiLocation = "//api.3dwayfinder.com/";
        wayfinder.options.assetsLocation =
            '//static.3dwayfinder.com/shared/';
        wayfinder.open("36e53da86b67f005d9479a139aeee60c"); //demo_tasku
        //wayfinder.open( "94d921a4e23e79634cd110483e6796a7" ); //kvartal

    }
    else {
        WayfinderAPI.LOCATION = "../../../../api";
        //wayfinder.options.assetsLocation = "http://localhost";
        wayfinder.options.assetsLocation =
            '../../../../shared';
        wayfinder.open();
    }
    wayfinder.statistics.start();
}]);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wfApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($route, $locationProvider, $httpProvider) {
        $route
            .when('/', {
                templateUrl: "views/default.html",
                controller: 'MainController'
            })
            .when('/info&:id/', {
                templateUrl: "views/info.html",
                controller: 'InfoController'
            })
            .when('/search/', {
                templateUrl: "views/search.html",
                controller: 'SearchController'
            })
            .when('/atoz/', {
                templateUrl: "views/atoz.html",
                controller: 'AtozController'
            })
            /*
             .when('/floors', {
             templateUrl: "views/floors.html",
             controller: 'GroupsCtrl'
             }) */
            .when('/topics/', {
                templateUrl: 'views/topics.html',
                controller: 'TopicsController'
            })
            .when('/topics&:id?/', {
                templateUrl: 'views/topics.html',
                controller: 'TopicsController'
            })
            .otherwise({
                redirectTo: '/topics/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        $locationProvider.hashPrefix('/');

        $httpProvider.useApplyAsync(true);
    }
]);

wfApp.directive('resize', function ($window) {
    return {
        restrict: 'AEC',
        scope: {
            cbResize: '&cbResize'
        },
        link: function (scope, element) {

            var w = element[0];
            scope.getWindowDimensions = function () {
                return {
                    'h': w.clientHeight,
                    'w': w.clientWidth
                };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function () {
                    return {
                        'height': ( newValue.h - 10 ) +
                        'px',
                        'width': ( newValue.w - 10 ) +
                        'px'
                    };
                };

            }, true);

            angular.element($window).bind('resize', function () {
                scope.$apply(function () {
                    scope.cbResize();
                });
            });
        }
    }
});

wfApp.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

wfApp.directive('floorButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="floor-button" class="button"' +
        ' ng-class="{\'active\':floor.active}"' +
        ' ng-click="changeFloor(floor)"' +
        ' ng-repeat="floor in floors | orderBy: \'index\' | reverse"' +
        ' ng-bind-html="floor.getNames() | wfCurrentLanguage"></div>'
    }
});

wfApp.directive('shortcutButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcut-button" class="button"' +
        ' ng-bind-html="shortcut.capital" ng-repeat="shortcut in shortcuts"' +
        ' ng-click="showGroupNearest(shortcut)" ng-style="{\'background-image\':' +
        ' \'url({{shortcut.backgroundImage}})\'}"></div>'
    }
});

wfApp.directive('floorsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="floors-menu" ' +
        'class="button-group expanded"' +
        ' ng-controller="MapControlsController">' +
        '<floor-button></floor-button>' +
        '</div>'
    }
});

wfApp.directive('shortcutsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcuts-menu"' +
        ' class="button-group"' +
        ' ng-controller="MapControlsController">' +
        '<shortcut-button></shortcut-button>' +
        '</div>'
    }
});

wfApp.directive('mapControls', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="map-controls"' +
        ' ng-controller="MapControlsController">' +
        '<shortcuts-menu></shortcuts-menu>' +
        '<floors-menu></floors-menu>' +
        '</div>'
    }
});

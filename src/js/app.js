// Declare app level module which depends on filters, and services
var wayfinderApp = angular.module('app', [
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

wayfinderApp.run(['wfangular3d', '$rootScope', '$http', '$route', function(wayfinder,
    $rootScope, $http, $route) {
    $route.reload();
    //WayfinderAPI.LOCATION = "//api.3dwayfinder.com/";
    //wayfinder.options.apiLocation = "//api.3dwayfinder.com/";
    //wayfinder.options.assetsLocation =
      //  '//static.3dwayfinder.com/shared/';
    //wayfinder.open("e547ad92ddc8774307993faff5ad79d0"); //tasku
    wayfinder.open("94d921a4e23e79634cd110483e6796a7"); //kvartal
    wayfinder.statistics.start();
}]);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wayfinderApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($route, $locationProvider, $httpProvider) {
    $route
        .when('/', {
            templateUrl: "views/default.html",
            controller: 'MainController as MC'
        })
        .when('/info&:id', {
            templateUrl: "views/info.html",
            controller: 'InfoController as IC'
        })
        .when('/search', {
            templateUrl: "views/search.html",
            controller: 'SearchController as SC'
        })
        .when('/atoz', {
            templateUrl: "views/atoz.html",
            controller: 'AtozController as AZC'
        })
        /*
               .when('/floors', {
                   templateUrl: "views/floors.html",
                   controller: 'GroupsCtrl'
               }) */
        .when('/topics', {
            templateUrl: 'views/topics.html',
            controller: 'TopicsController as TC'
        })
        .when('/topics&:id?', {
            templateUrl: 'views/topics.html',
            controller: 'TopicsController as TC'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
    $locationProvider.hashPrefix('!');

    $httpProvider.useApplyAsync(true);
}]);

wayfinderApp.directive('resize', function($window) {
    return {
        restrict: 'AEC',
        scope: {
            cbResize: '&cbResize'
        },
        link: function(scope, element, attrs) {

            var w = element[0]
            scope.getWindowDimensions = function() {
                return {
                    'h': w.clientHeight,
                    'w': w.clientWidth
                };
            };

            scope.$watch(scope.getWindowDimensions, function(
                newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function() {
                    return {
                        'height': (newValue.h - 10) +
                            'px',
                        'width': (newValue.w - 10) +
                            'px'
                    };
                };

            }, true);

            angular.element($window).bind('resize', function() {
                scope.$apply(function() {
                    scope.cbResize();
                });
            });
        }
    }
});

// Declare app level module which depends on filters, and services
var wfApp = angular.module( 'wfApp', [
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
] );

wfApp.run( [ 'wfangular3d', '$rootScope', '$http', '$route', function (
    wayfinder,
    $rootScope, $http, $route ) {
    $route.reload();
    //WayfinderAPI.LOCATION = "//api.3dwayfinder.com/";
    //wayfinder.options.apiLocation = "//api.3dwayfinder.com/";
    //wayfinder.options.assetsLocation =
    //  '//static.3dwayfinder.com/shared/';
    //wayfinder.open("e547ad92ddc8774307993faff5ad79d0"); //tasku
    wayfinder.open( "94d921a4e23e79634cd110483e6796a7" ); //kvartal
    wayfinder.statistics.start();
} ] );

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wfApp.config( [ '$routeProvider', '$locationProvider', '$httpProvider',
    function ( $route, $locationProvider, $httpProvider ) {
        $route
            .when( '/', {
                templateUrl: "views/default.html",
                controller: 'MainController'
            } )
            .when( '/info&:id', {
                templateUrl: "views/info.html",
                controller: 'InfoController'
            } )
            .when( '/search', {
                templateUrl: "views/search.html",
                controller: 'SearchController'
            } )
            .when( '/atoz', {
                templateUrl: "views/atoz.html",
                controller: 'AtozController'
            } )
            /*
                   .when('/floors', {
                       templateUrl: "views/floors.html",
                       controller: 'GroupsCtrl'
                   }) */
            .when( '/topics', {
                templateUrl: 'views/topics.html',
                controller: 'TopicsController'
            } )
            .when( '/topics&:id?', {
                templateUrl: 'views/topics.html',
                controller: 'TopicsController'
            } )
            .otherwise( {
                redirectTo: '/topics'
            } );

        $locationProvider.html5Mode( {
            enabled: true,
            requireBase: true
        } );
        $locationProvider.hashPrefix( '!' );

        $httpProvider.useApplyAsync( true );
    }
] );

wfApp.directive( 'resize', function ( $window ) {
    return {
        restrict: 'AEC',
        scope: {
            cbResize: '&cbResize'
        },
        link: function ( scope, element, attrs ) {

            var w = element[ 0 ]
            scope.getWindowDimensions = function () {
                return {
                    'h': w.clientHeight,
                    'w': w.clientWidth
                };
            };

            scope.$watch( scope.getWindowDimensions, function (
                newValue, oldValue ) {
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

            }, true );

            angular.element( $window ).bind( 'resize', function () {
                scope.$apply( function () {
                    scope.cbResize();
                } );
            } );
        }
    }
} );

wfApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

wfApp.directive( 'floorButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="floor-button" class="button" ng-class="{\'active\':floor.active}" ng-click="changeFloor(floor)" ng-repeat="floor in floors | orderBy: \'index\' | reverse" ng-bind-html="floor.getNames() | wfCurrentLanguage"></div>'
    }
} );

wfApp.directive( 'shortcutButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcut-button" class="button" ng-bind-html="shortcut.capital" ng-repeat="shortcut in shortcuts" style="background-image: url({{shortcut.backgroundImage}})"></div>'
    }
} );

wfApp.directive( 'floorsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="floors-menu" class="button-group expanded"><floor-button></floor-button></div>'
    }
} );

wfApp.directive( 'shortcutsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcuts-menu" class="button-group expanded"><shortcut-button></shortcut-button></div>'
    }
} );

wfApp.directive( 'mapControls', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="map-controls" ng-controller="MapControlsController"><shortcuts-menu></shortcuts-menu><floors-menu></floors-menu></div>'
    }
} );

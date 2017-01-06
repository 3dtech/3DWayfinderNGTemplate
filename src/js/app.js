/* global $ */
var navMenu = $('#nav-menu');
var navMenuButton = $('#nav-menu-btn');
var hideNavMenu = function() {
    if (navMenu.hasClass('active')) {
        navMenuButton.removeClass("icon-iglu-cancel");
        navMenuButton.addClass("icon-iglu-search");
        navMenu.removeClass('active');
    }
};
var showNavMenu = function() {
    if (!navMenu.hasClass('active')) {
        navMenuButton.removeClass('icon-iglu-search');
        navMenuButton.addClass('icon-iglu-cancel');
        navMenu.addClass('active');
    }
};

var toggleNavMenu = function() {
    if (navMenu.hasClass('active')) {
        navMenuButton.removeClass("icon-iglu-cancel");
        navMenuButton.addClass("icon-iglu-search");
        navMenu.removeClass('active');
    }
    else {
        navMenuButton.removeClass("icon-iglu-search").addClass("icon-iglu-cancel");
        navMenu.addClass('active');
    }
};

// Declare app level module which depends on filters, and services
var wfApp = angular.module('wfApp', [
    'ngSanitize',
    // 'angular-loading-bar',
    'ngAnimate',
    'cfp.loadingBar',
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

wfApp.value('toggleNavMenu', toggleNavMenu);
wfApp.value('hideNavMenu', hideNavMenu);
wfApp.value('showNavMenu', showNavMenu);

wfApp.run(['wfangular', '$rootScope', '$http', '$route', '$location',
    function(wayfinder, $rootScope, $http, $route, $location) {
        $route.reload();
        if ($location.port() != 80) {
            wayfinder.options.assetsLocation =
                '//static.3dwayfinder.com/shared/';
            wayfinder.open();
        }
        else {
            wayfinder.options.assetsLocation =
                '../../../../shared';
            wayfinder.open();
        }
        wayfinder.statistics.start();
    }
]);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wfApp.config(['$routeProvider', '$locationProvider', '$httpProvider', 'cfpLoadingBarProvider',
    function($route, $locationProvider, $httpProvider, cfpLoadingBarProvider) {
        $route
            .when('/', {
                templateUrl: "views/default.html",
                controller: 'MainController'
            })
            .when('/info&:id?/', {
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

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: true
        // })
        $locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix('/');

        $httpProvider.useApplyAsync(true);

        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
        cfpLoadingBarProvider.latencyThreshold = 500;
    }
]);

wfApp.directive('resize', function($window) {
    return {
        restrict: 'AEC',
        scope: {
            cbResize: '&cbResize'
        },
        link: function(scope, element) {

            var w = element[0];
            scope.getWindowDimensions = function() {
                return {
                    'h': w.clientHeight,
                    'w': w.clientWidth
                };
            };

            scope.$watch(scope.getWindowDimensions, function(newValue) {
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

wfApp.filter('reverse', function() {
    return function(items) {
        if (!!items) {
            return items.slice().reverse();
        }
        return !!items;
    };
});

wfApp.directive('floorButton', function() {
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

wfApp.directive('languageButton', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div></div>'
    }
});

wfApp.directive('shortcutButton', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcut-button" class="button"' +
            ' ng-bind-html="shortcut.capital" ng-repeat="shortcut in shortcuts"' +
            ' ng-click="showGroupNearest(shortcut)" ng-style="{\'background-image\':' +
            ' \'url({{shortcut.backgroundImage}})\'}"></div>'
    }
});

wfApp.directive('floorsMenu', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="floors-menu" ' +
            'class="button-group expanded"' +
            ' ng-show="showFloorsMenu"' +
            ' ng-controller="ControlsController">' +
            '<floor-button></floor-button>' +
            '</div>'
    }
});

wfApp.directive('shortcutsMenu', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="shortcuts-menu"' +
            ' class="button-group"' +
            ' ng-show="showShortcutsMenu"' +
            ' ng-controller="ControlsController">' +
            '<shortcut-button></shortcut-button>' +
            '</div>'
    }
});

wfApp.directive('mapControls', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div id="map-controls"' +
            ' ng-controller="ControlsController">' +
            '<shortcuts-menu></shortcuts-menu>' +
            '<floors-menu></floors-menu>' +
            '</div>'
    }
});

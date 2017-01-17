/* global $ */
var navMenu = $('#nav-menu');
var navMenuButton = $('#nav-menu-btn');
var hideNavMenu = function () {
    if (navMenu.hasClass('active')) {
        navMenuButton.removeClass("icon-iglu-cancel");
        navMenuButton.addClass("icon-iglu-search");
        navMenu.removeClass('active');
    }
};
var showNavMenu = function () {
    if (!navMenu.hasClass('active')) {
        navMenuButton.removeClass('icon-iglu-search');
        navMenuButton.addClass('icon-iglu-cancel');
        navMenu.addClass('active');
    }
};

var toggleNavMenu = function () {
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
    'ngAnimate',
    'cfp.loadingBar',
    'ngRoute',
    'wfangular'
]);

wfApp.value('toggleNavMenu', toggleNavMenu);
wfApp.value('hideNavMenu', hideNavMenu);
wfApp.value('showNavMenu', showNavMenu);

wfApp.config(['wfangularConfig', function(wfconfig) {
    wfconfig.mapType = '3d';
}]);

wfApp.run(['wfangular', '$rootScope', '$http', '$route', '$location',
    function (wayfinder, $rootScope, $http, $route, $location) {
        $route.reload();
        if ($location.port() != 80 || $location.port() != 443) {
            wayfinder.options.assetsLocation =
                '//static.3dwayfinder.com/shared/';
            wayfinder.open();
        }
        else {
            wayfinder.options.assetsLocation =
                '../../../shared';
            wayfinder.open();
        }
        wayfinder.statistics.start();
    }
]);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wfApp.config(['$routeProvider', '$locationProvider', '$httpProvider', 'cfpLoadingBarProvider',
    function ($route, $locationProvider, $httpProvider, cfpLoadingBarProvider) {
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

        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div class="spinner-template"><span class="fa fa-spinner">3DWayfinder is loading...</span></div>';
        cfpLoadingBarProvider.latencyThreshold = 500;
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
                        'height': (newValue.h - 10) +
                        'px',
                        'width': (newValue.w - 10) +
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
        if (!!items) {
            return items.slice().reverse();
        }
        return !!items;
    };
});

wfApp.directive('floorButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:"/templates/floorButton.html"
    }
});

wfApp.directive('languageButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<div></div>'
    }
});

wfApp.directive('shortcutButton', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'/templates/shortcutButton.html'
    }
});

wfApp.directive('floorsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: '/templates/floorsMenu.html'
    }
});

wfApp.directive('shortcutsMenu', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'/templates/shortcutsMenu.html'
    }
});

wfApp.directive('mapControls', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'/templates/mapControls.html'
    }
});

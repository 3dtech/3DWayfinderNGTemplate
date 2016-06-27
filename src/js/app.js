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

wayfinderApp.run(['wfangular3d', '$rootScope', '$http', function(wayfinder,
    $rootScope, $http) {
    //WayfinderAPI.LOCATION = "//api.3dwayfinder.com/";
    wayfinder.options.apiLocation = "//api.3dwayfinder.com/";
    wayfinder.options.assetsLocation =
        '//static.3dwayfinder.com/shared/';
    wayfinder.open(); //tasku
}]);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wayfinderApp.config(['$routeProvider', function($route) {
    $route
        .when('/', {
            templateUrl: "views/default.html",
            controller: 'WayfinderCtrl'
        })
        .when('/info/:id', {
            templateUrl: "views/extra-info.html",
            controller: 'InfoController'
        })
        .when('/search', {
            templateUrl: "views/search.html",
            controller: 'SearchController'
        })
        .when('/atoz', {
            templateUrl: "views/atoz.html",
            controller: 'AtozController'
        })
        /*
               .when('/floors', {
                   tempalteUrl: "views/floors.html",
                   controller: 'GroupsCtrl'
               }) */
        .when('/topics', {
            templateUrl: 'views/topics.html',
            controller: 'TopicsController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// -------------------------------------------
// --------------- Controllers ---------------
// -------------------------------------------

wayfinderApp.controller('WayfinderCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  'wayfinderService',
  'keyboardService',
  'wfangular3d',
  function($scope, $timeout, $rootScope, wayfinderService, keyboardService,
        wayfinder) {
        $scope.animationsEnabled = true;
        $scope.bold = ['\<b\>', '\<\/b\>'];

        var modalInstance;

        var lastTouch = -1;
        lastTouch = (new Date()).getTime();
        var maxInactivityTime = 3000;

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
        };

        /*** SCREENSAVER CONTROLS ***/

        function hideScreensaver() {
            $rootScope.$broadcast("app.screensaving", false);
            // here reset all the local variables, like menu items and stuff?jah
        };

        function showScreensaver() {
            $rootScope.$broadcast("app.screensaving", true);
            // show modal, mõttekam oleks vist mitte modal'it kasutada, sest sisu on pidevalt sama
        };

        /*** ACTIVITY CHECKER ***/

        function checker() {
            console.log("Checker! time since lastTouch", (((new Date())
                .getTime() - lastTouch) / 1000), "sec");
            var time = (new Date()).getTime();
            if (time - lastTouch > maxInactivityTime) {
                if (lastTouch > -1) {
                    onTimeout();
                } else {
                    $timeout(checker, maxInactivityTime);
                };
            } else {
                $timeout(checker, maxInactivityTime - (time - lastTouch));
            };
        };

        function onTimeout() {
            console.log("onTimeout");
            lastTouch = -1; //Disables timeouting until somebody has touched
            wayfinder.statistics.onSessionEnd();
            wayfinder.restoreDefaultState();
            showScreensaver(); //näitame seda modalit
            console.log(lastTouch);
        };

        $scope.trigger = function() {
            console.log("Trigger! time since lastTouch", (((new Date())
                .getTime() - lastTouch) / 1000), "sec");
            //reset
            if (lastTouch == -1) {
                //first click in a while
                hideScreensaver();
                wayfinder.statistics.onSessionStart();
                $timeout(checker, maxInactivityTime);
            };
            lastTouch = (new Date()).getTime();
        };

        $timeout(checker, maxInactivityTime);

        /*** SCOPE FUNCTIONS ***/

        $scope.showYAH = function() {
            wayfinder.showKiosk();
        };

        $scope.cbResizeCtrl = function() {
            wayfinder.resize();
        };

        $scope.getGUITranslation = function(key, params) {
            if (params) return wayfinder.translator.get(key);
            return wayfinder.translator.get(key, params);
        };

        /*** EVENT WATCHERS ***/

        /*** ROOTSCOPE WATCHERS ***/

        /*** SCOPE WATCHERS ***/
        $scope.$on('wf.language.change', function(key) {});

        $scope.$on('app.screensaving', function(event, screensaving) {
            $scope.screensaving = screensaving;
        })

        $scope.$on('wf.zoom.change', function(event, zoom) {
            if (!$scope.screensaving && lastTouch > -1) {
                $scope.trigger();
            };
        });

        $scope.$on('wf.toggle-nav-menu', function(event) {
            $scope.toggleNavMenu();
        });

        $scope.$on("wf.poi.click", function(event, poi) {});

        $scope.$on('app.screensaving', function(event, screensaving) {
            if (screensaving) {
                $scope.showYAH();
            }
        });

        $scope.$on('wf.data.loaded', function(event, asi) {
            console.log("WayfinderCtrl-wf.data.loaded");
            $timeout(
                function() {
                    if (!$scope.tabs)
                        $scope.tabs = wayfinderService.getTabs();
                    if (!wayfinderService.getGroups())
                        wayfinderService.setGroups(
                            wayfinder.getPOIGroups());
                    if (!wayfinderService.getPOIs())
                        wayfinderService.setPOIs(wayfinder.getPOIsArray());
                    if (!wayfinderService.getFloorsPOIs())
                        wayfinderService.setFloorsPOIs(
                            wayfinder.building
                            .floors);
                    if (!wayfinderService.getAtozLetters())
                        wayfinderService.setAtozLetters(
                            wayfinder.getPOIs(),
                            wayfinder.getLanguage());
                }, 10);
            if (wayfinder.settings.data["kiosk.max-inactivity"]) {
                maxInactivityTime = parseInt(wayfinder.settings
                        .data["kiosk.max-inactivity"], 10) *
                    1000;
                wayfinder.setKiosk("394");
            };
        });
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

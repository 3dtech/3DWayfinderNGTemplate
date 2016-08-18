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
            controller: 'WayfinderCtrl as WFC'
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

// -------------------------------------------
// --------------- Controllers ---------------
// -------------------------------------------

wayfinderApp.controller('WayfinderCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  '$location',
  'wayfinderService',
  'keyboardService',
  'wfangular3d',
  function($scope, $timeout, $rootScope, $location, wayfinderService, keyboardService,
        wayfinder) {
        $scope.animationsEnabled = true;
        $scope.bold = ['\<b\>', '\<\/b\>'];

        var modalInstance;

        var lastTouch = -1;
        lastTouch = (new Date()).getTime();
        var maxInactivityTime = 3000;

        $scope.go = function(path) {
            console.debug("path:", path);
            $location.path(path);
        };

        $scope.showTopic = function(group) {
            var path = '/topics&'+group.id;
            for (var k in wayfinderService.getTabs()) {
                if (wayfinderService.getTabs()[k].name == "topics") {
                    wayfinderService.setActiveTab(wayfinderService.getTabs()[k]);
                    break;
                }
            }
            $location.path(path);
        };

        $scope.showInfo = function(poi) {
            var path = '/info&'+poi.id;
            $location.path(path);
        };

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
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

        $scope.setActiveTab = function(tab) {
            console.debug("WFC.setActvieTab:", tab);
            wayfinderService.setActiveTab(tab);
        };

        $scope.getActiveTab = function() {
            return wayfinderService.getActiveTab();
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
            console.log("tabs:", wayfinderService.getTabs());
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

/* global $, angular */
// var navMenu = $('#nav-menu');
// var navMenuButton = $('#nav-menu-btn');
// var hideNavMenu = function() {
// 	if (navMenu.hasClass('active')) {
// 		navMenuButton.removeClass("icon-iglu-cancel");
// 		navMenuButton.addClass("icon-iglu-search");
// 		navMenu.removeClass('active');
// 	}
// };
// var showNavMenu = function() {
// 	if (!navMenu.hasClass('active')) {
// 		navMenuButton.removeClass('icon-iglu-search');
// 		navMenuButton.addClass('icon-iglu-cancel');
// 		navMenu.addClass('active');
// 	}
// };

// var toggleNavMenu = function() {
// 	if (navMenu.hasClass('active')) {
// 		navMenuButton.removeClass("icon-iglu-cancel");
// 		navMenuButton.addClass("icon-iglu-search");
// 		navMenu.removeClass('active');
// 	}
// 	else {
// 		navMenuButton.removeClass("icon-iglu-search").addClass("icon-iglu-cancel");
// 		navMenu.addClass('active');
// 	}
// };

// Declare app level module which depends on filters, and services
var wfApp = angular.module('wfApp', [
	'ngSanitize',
	'ngAnimate',
	'cfp.loadingBar',
	'ngRoute',
	'wfangular'
]);

// wfApp.value('toggleNavMenu', toggleNavMenu);
// wfApp.value('hideNavMenu', hideNavMenu);
// wfApp.value('showNavMenu', showNavMenu);

// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------

wfApp.config(['wfangularConfig', '$routeProvider', '$locationProvider', '$httpProvider', 'cfpLoadingBarProvider',
	function(wfConfig, $route, $locationProvider, $httpProvider, cfpLoadingBarProvider) {
		$route

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
				redirectTo: '/'
			});

		// @ifdef type3D
		wfConfig.mapType = "3d";
		// @endif

		// @ifdef type2D
		wfConfig.mapType = "2d";
		// @endif

		cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
		cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
		cfpLoadingBarProvider.latencyThreshold = 500;
	}
]);

wfApp.run([
	'wfangular',
	'wfangularConfig',
	'$rootScope',
	'$http',
	'$route',
	'$location',
	function(wayfinder, wfConfig, $rootScope, $http, $route, $location) {
		$route.reload();
		if ($location.port() != 80 || $location.port() != 443) {
			if (wfConfig.mapType == "3d")
				wayfinder.options.assetsLocation = '//static.3dwayfinder.com/shared/';
		}
		else {
			if (wfConfig.mapType == "3d")
				wayfinder.options.assetsLocation = '../../../../shared';
		}

		// 2d: dc96de58dda5386c5849fa7b5df26d1c
		// 3d: 599a8cbdf993e8f913641ea551908707
		wayfinder.open();
		wayfinder.statistics.start();
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

wfApp.directive('floorsMenu', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: '/templates/floorsMenu.html'
	}
});

wfApp.directive('shortcutsMenu', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: '/templates/shortcutsMenu.html'
	}
});

wfApp.directive('mapControls', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: '/templates/mapControls.html'
	}
});

wfApp.directive('ngHold', [function() {
	return {
		restrict: "A",
		link: function(scope, elm, attrs) {

		},
		controller: ["$scope", "$element", "$attrs", "$transclude", "$timeout", function($scope, $element, $attrs, $transclude, $timeout) {
			var onHold = function() {
				return $scope.$eval($attrs.ngHold);
			};
			var onDone = function() {
				return $scope.$eval($attrs.ngHoldDone);
			};

			var intervals = [];
			($attrs.ngHoldInterval || "500").split(",").forEach(function(interval) {
				intervals.push(interval.split(";"));
			});
			var timeout = null;
			var intervalIdx;
			var intervalCount;

			function timeoutFoo() {
				intervalCount++;
				var max = intervals[intervalIdx].length == 1 ? 1 : intervals[intervalIdx][1];
				if (intervalCount > max) {
					intervalIdx = Math.min(intervalIdx + 1, intervals.length - 1);
					intervalCount = 1;
				}
				timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
				onHold();
			}

			$element.on("mousedown", function(e) {
				intervalIdx = 0;
				intervalCount = 1;
				timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
				$scope.$apply(onHold);
			});
			$element.on("mouseup", function(e) {
				if (!!timeout) {
					$timeout.cancel(timeout);
					$scope.$apply(onDone);
					timeout = null;
				}
			});
			$element.on("mouseleave", function(e) {
				if (!!timeout) {
					$timeout.cancel(timeout);
					$scope.$apply(onDone);
					timeout = null;
				}
			});
		}]
	};
}]);

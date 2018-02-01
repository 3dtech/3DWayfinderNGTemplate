/* global $, angular */

// Declare app level module which depends on filters, and services
var wfApp = angular.module('wfApp', [
	'ui.router',
	'ngSanitize',
	'ngAnimate',
	'cfp.loadingBar',
	'naturalSort',
	'wfangular'

]);


// ------------------------------------------
// ----------------- config -----------------
// ------------------------------------------


wfApp.config(['wfangularConfig', 'cfpLoadingBarProvider', '$stateProvider', '$urlRouterProvider',
	function (wfangularConfig, cfpLoadingBarProvider, $stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('search', {
				url: '/search',
				templateUrl: 'views/search.html',
				controller: 'SearchController'
			})
			.state('atoz', {
				url: '/atoz',
				templateUrl: 'views/atoz.html',
				controller: 'AtozController'
			})
			.state('topics', {
				url: '/topics',
				templateUrl: 'views/topics.html',
				controller: 'TopicsController'
			})
			.state('topics.details', {
				url: '/topics/:id',
				templateUrl: 'views/topics.html',
				controller: 'TopicsController'
			})
			.state('info', {
				url: '/info/:id',
				templateUrl: 'views/info.html',
				controller: 'InfoController'
			});

		// @ifdef type3D
		wfangularConfig.mapType = "3d";
		// @endif
		// @ifdef type2D
		wfangularConfig.mapType = "2d";
		// @endif

		// @if DEBUG
		wfangularConfig.apiLocation = "//api.3dwayfinder.com/";
		// @endif
		// @if !DEBUG
		wfangularConfig.apiLocation = "../../../api/";
		// @endif
		cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
		cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-logo-container"><img src="lib/img/logo.png" alt=""></div>';
		cfpLoadingBarProvider.latencyThreshold = 500;
	}
]);

wfApp.run([
	'wfangular',
	'wfangularConfig',
	'$rootScope',
	'$http',
	'$state',
	function (wayfinder, wfangularConfig, $rootScope, $http, $state) {
		$state.reload('info');

		if (wfangularConfig.mapType === "3d") {
			// @if DEBUG
			wayfinder.options.assetsLocation = '//static.3dwayfinder.com/shared/';
			// @endif
			// @if !DEBUG
			wayfinder.options.assetsLocation = '../../../shared';
			// @endif
		}

		// 2d: dc96de58dda5386c5849fa7b5df26d1c
		// 3d: 599a8cbdf993e8f913641ea551908707

		wayfinder.open();

		wayfinder.statistics.start();
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
	};
});

wfApp.filter('reverse', function () {
	return function (items) {
		if (!!items) {
			return items.slice().reverse();
		}
		return !!items;
	};
});

wfApp.directive('floorsMenu', function () {
	return {
		restrict: 'AE',
		replace: 'true',
		template: '<div id="floors-menu" class="btn-group" ng-show="showFloorsMenu" ng-controller="ControlsController">' +
		'<div class="floor-button" ng-class="{\'active\':floor.active}" ng-click="changeFloor(floor)" ng-repeat="floor in floors | orderBy: \'index\' | reverse" ng-bind-html="floor.getNames() | wfCurrentLanguage" ng-if="floor.showInMenu">' +
		'' +
		'</div>'
	};
});

wfApp.directive('shortcutsMenu', function () {
	return {
		restrict: 'AE',
		replace: 'true',
		template: '<div id="shortcuts-menu" class="button-group" ng-show="showShortcutsMenu" ng-controller="ControlsController">' +
		'<div ng-if="shortcut.pois[0]" class="button shortcut-button" ng-bind-html="shortcut.capital" ng-repeat="shortcut in shortcuts" ng-click="showGroupNearest(shortcut)" ng-style="{\'background-image\': \'url({{shortcut.backgroundImage}})\'}"> ' +
		'</div> ' +
		'</div>'
	};
});


wfApp.directive('mapControls', function () {
	return {
		restrict: 'AE',
		replace: 'true',
		template: '<div id="map-controls" ng-controller="ControlsController">' +
		'<shortcuts-menu></shortcuts-menu>' +
		'<floors-menu></floors-menu>' +
		'</div>'
	};
});

wfApp.directive('ngHold', [function () {
	return {
		restrict: "A",
		link: function (scope, elm, attrs) {

		},
		controller: ["$scope", "$element", "$attrs", "$transclude", "$timeout", function ($scope, $element, $attrs, $transclude, $timeout) {
			var onHold = function () {
				return $scope.$eval($attrs.ngHold);
			};
			var onDone = function () {
				return $scope.$eval($attrs.ngHoldDone);
			};

			var intervals = [];
			($attrs.ngHoldInterval || "50").split(",").forEach(function (interval) {
				intervals.push(interval.split(";"));
			});
			var timeout = null;
			var intervalIdx;
			var intervalCount;

			function timeoutFoo() {
				intervalCount++;
				var max = intervals[intervalIdx].length === 1 ? 1 : intervals[intervalIdx][1];
				if (intervalCount > max) {
					intervalIdx = Math.min(intervalIdx + 1, intervals.length - 1);
					intervalCount = 1;
				}
				timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
				onHold();
			}

			$element.on("mousedown", function (e) {
				intervalIdx = 0;
				intervalCount = 1;
				timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
				$scope.$apply(onHold);
			});
			$element.on("mouseup", function (e) {
				if (!!timeout) {
					$timeout.cancel(timeout);
					$scope.$apply(onDone);
					timeout = null;
				}
			});
			$element.on("mouseleave", function (e) {
				if (!!timeout) {
					$timeout.cancel(timeout);
					$scope.$apply(onDone);
					timeout = null;
				}
			});
			$element.on('touchstart', function (e) {
				intervalIdx = 0;
				intervalCount = 1;
				timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
				$scope.$apply(onHold);
			});
			$element.on("touchend", function (e) {
				if (!!timeout) {
					$timeout.cancel(timeout);
					$scope.$apply(onDone);
					timeout = null;
				}
			});
		}]
	};
}]);

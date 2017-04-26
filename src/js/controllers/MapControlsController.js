//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('ControlsController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'wfService',
	'wfangular',
	function ($rootScope, $scope, $timeout, wfService, wayfinder) {
		$scope.floors = wfService.data.floors;
		$scope.shortcuts = wfService.data.shortcuts;
		$scope.activeFloor = wfService.data.activeFloor;
		$scope.showFloorsMenu = true;
		$scope.showShortcutsMenu = true;
		$scope.showZoomMenu = true;
		//console.debug("wfService.data:", wfService.data);

		$scope.changeFloor = function (floor) {
			wayfinder.showFloor(floor);
		};

		$scope.$on('wf.floor.change', function (event, floor) {
			$timeout(function () {
				$scope.activeFloor = wfService.getActiveFloor();
			}, 10);
		});

		$timeout(function () {
			if (!(!!$scope.floors) && !(!!$scope.shortcuts)) {
				// console.debug(
				// 	"checking for floors and shortcuts:",
				// 	$scope.floors,
				// 	$scope.shortcuts,
				// 	wfService.data
				// );
				$scope.$apply();
			}
		}, 1000);

		$scope.zoomIn = function () {
			// console.debug("map zoom in");
			wayfinder.zoomIn();
		};

		$scope.zoomOut = function () {
			// console.debug("map zoom out");
			wayfinder.zoomOut();
		};

		$scope.$on("wfService.data.loaded", function () {

			// console.debug("wfService.data.loaded caught:");
			$scope.$apply(function () {
				if (!(!!$scope.floors)) {
					$scope.floors = wfService.data.floors;
					$scope.showFloorsMenu = $scope.floors.length >= 2;
					// console.debug("showFloorsMenu:", $scope.showFloorsMenu);
				}
				if (!(!!$scope.shortcuts)) {
					$scope.shortcuts = wfService.data.shortcuts;
					$scope.showShortcutsMenu = $scope.shortcuts.length >= 1;
					// console.debug("showShortcutsMenu:", $scope.showShortcutsMenu);
				}
			});
		});
	}
]);

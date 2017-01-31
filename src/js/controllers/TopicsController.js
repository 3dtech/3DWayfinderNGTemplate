/* global $, angular, wfApp, WayfinderAPI */

/**
 * Controller to handle logic going on in topics view
 */

wfApp.controller('TopicsController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$routeParams',
	'wfService',
	'wfangular',
	function($rootScope, $scope, $timeout, $routeParams, wfService, wayfinder) {
		// console.debug("TC.loaded");
		var topics = $scope;
		$scope.groups = wfService.data.groups;
		$scope.activeGroup = "";
		var wfTopicsDataLoaded = false;
		$scope.collapsedGroup = [];
		$scope.collapsedFloor = [];
		$scope.activeLetter = "";

		$scope.showPath = function(poi) {
			console.log("showPath.poi:", poi, wayfinder.getKiosk(),
				wayfinder.getKioskNode());
			$rootScope.$broadcast("wf.nav-menu", "hide");
			wayfinder.showKiosk();
			wayfinder.showPath(poi.getNode(), poi);
		};

		/**
		 * Function for expanding and collapsing a topic
		 * @param group
		 * @returns {number}
		 */
		$scope.toggleGroupActive = function(group) {
			group.active = !group.active;
		};

		/**
		 * Function to fetch currently active language
		 * @returns {*}
		 */
		$scope.getLanguage = function() {
			return wayfinder.getLanguage();
		};

		/**
		 * Currently unused function
		 * @param group
		 */
		$scope.expand = function(group) {
			group.show = !group.show;
		};

		/**
		 * Watcher to check if a group is collapsed or not
		 */
		$scope.$watch("collapsedGroup", function(newVal, oldVal) {
			//console.log("collapsedGroup:", oldVal, "->", newVal);
		});

		function checkRouteParams() {
			if (!$routeParams) return;
			$scope.$apply(function() {
				$scope.groups = wfService.data.groups;
			});
			angular.forEach($scope.groups, function(element,key) {
				if (element.id == $routeParams.id) {
					$scope.$apply(function() {
						$scope.groups[key].active = element.id == $routeParams.id;
					});
					$rootScope.$broadcast("wf.nav-menu", "show");

				}
			});

			$rootScope.$broadcast("wf.nav-menu", "show");
		}
		/**
		 * This event is dispatched when the controller is initialized
		 * @param topics is passed along with the event, which is captured by the service
		 * which in turn will insert the data into the variable
		 */
		$rootScope.$emit("topics.init", topics);

		/**
		 * This watcher waits for the "wf.topic.selected" event, which is sent by the AtoZ
		 * controller when the user selects a topics from the AtoZ menu
		 */
		$scope.$on('wf.topic.selected', function(event, group) {
			// console.debug("selected.topic:", group);
			if ($routeParams) {
				for (var key in $scope.groups) {

					$scope.groups[key].active = $scope.groups[key].id == $routeParams.id;
					console.log(key,$scope.groups[key].active);

				}
			}
		});
		$scope.$on("wf.map.ready", function(event) {

			checkRouteParams();
		});

		$timeout(function () {
			checkRouteParams();
		}, 10);

		/*$scope.$on("wf.data.loaded", function() {
		 $timeout(function() {
		 $scope.groups = wayfinderService.getGroups();
		 if ($routeParams) {
		 for (var key in $scope.groups) {
		 if ($scope.groups[key].id == $routeParams.id)
		 $scope.groups[key].active = true;
		 else
		 $scope.groups[key].active = false;
		 }
		 }
		 console.log("TopicsController-wf.data.loaded");
		 $scope.$apply();
		 }, 20);
		 });*/

		/*topics.$on( 'wfService.groups.loading', function ( event ) {
		 console.debug( "TOPICS: wfService.loading " );
		 $timeout( function () {
		 $rootScope.$emit( "topics.init", topics );
		 }, 100 );
		 } );

		 topics.$on( 'wfService.groups.loaded', function ( event,
		 data ) {
		 if ( !wfTopicsDataLoaded ) {
		 $scope.$apply( function () {
		 wfTopicsDataLoaded = true;
		 console.debug(
		 "TOPICS: wfService.loaded" );
		 //topics.groups = wfService.getGroups();
		 } );
		 }
		 } );*/
	}
]);

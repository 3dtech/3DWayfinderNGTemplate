//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('InfoController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$routeParams',
	'$sce',
	'wfService',
	'wfangular',
	function(
		$rootScope,
		$scope,
		$timeout,
		$routeParams,
		$sce,
		wfService,
		wayfinder
	) {
		$scope.poi = null;
		// console.log("wfService.getPOIs():", wfService.getPOIs());
		// console.log("InfoController.poi", $scope.poi, $routeParams.id);

		$scope.showPath = function(poi) {
			$rootScope.$broadcast("wf.nav-menu", "hide");
			wayfinder.showPath(poi.getNode(), poi);
		};

		$scope.getLanguage = function() {
			return wayfinder.getLanguage();
		};

		$scope.hasDescription = function(poi) {
			// console.debug("hasDescription",poi);
			if (!poi) return 0;
			return poi.getDescription(wayfinder.getLanguage()) ? 1 :
				0;
		};

		$scope.getBackgroundImage = function(poi) {
			if (poi == null) return;
			// console.debug("info.getBackgroundImage:", poi.backgroundImage);
			return 'url(' + poi.backgroundImage + ')';
		};

		function checkRouteParams() {
			if (!$routeParams) return;
			console.debug("info.$routeParams:", $routeParams);
			angular.forEach(wfService.getPOIs(), function(element) {
				if (element.id == $routeParams.id) {
					if (element.getDescription(wayfinder.getLanguage())) {
						var desc = document.createElement("textarea");
						desc.innerHTML = element.getDescription(wayfinder.getLanguage());
						$scope.description = $sce.trustAsHtml(desc.value);
					}
					else {
						$scope.description = "";
					}
					$scope.$apply(function() {
						$scope.poi = element;
					});
					$rootScope.$broadcast("wf.nav-menu", "show");
					console.log("info.poi:", element);
				}
			});
		}

		$scope.$on("wf.map.ready", function(event) {
			console.debug("INFO:map.ready");
			checkRouteParams();
		});
	}
]);

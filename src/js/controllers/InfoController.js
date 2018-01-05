//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('InfoController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$stateParams',
	'$sce',
	'wfService',
	'wfangular',
	'$location',
	function ($rootScope,
			  $scope,
			  $timeout,
			  $stateParams,
			  $sce,
			  wfService,
			  wayfinder,
			  $location) {
		// console.log("wfService.getPOIs():", wfService.getPOIs());
		// console.log("InfoController.poi", $scope.poi, $stateParams.id);

		$scope.showPath = function (poi) {

			if(window.innerWidth<1024||(window.innerHeight > window.innerWidth)){
				$location.path('/');
				$rootScope.$broadcast("wf.nav-menu", "hide");
			}
			wayfinder.showPath(poi.getNode(), poi);
		};

		$scope.getLanguage = function () {
			return wayfinder.getLanguage();
		};

		$scope.hasDescription = function (poi) {
			// console.debug("hasDescription",poi);
			if (!poi) return 0;
			return poi.getDescription(wayfinder.getLanguage()) ? 1 : 0;
		};

		$scope.getBackgroundImage = function (poi) {
			if (poi == null) return;
			// console.debug("info.getBackgroundImage:", poi.backgroundImage);
			return 'url(' + poi.backgroundImage + ')';
		};

		function checkRouteParams() {
			if (!$stateParams) return;
			console.debug("info.$stateParams:", $stateParams);
			angular.forEach(wfService.getPOIs(), function (element) {
				if (element.id == $stateParams.id) {
					if (element.getDescription(wayfinder.getLanguage())) {
						var desc = document.createElement("textarea");
						desc.innerHTML = element.getDescription(wayfinder.getLanguage());
						$scope.description = $sce.trustAsHtml(desc.value);
					}
					else {
						$scope.description = "";
					}
					$scope.$apply(function () {
						$scope.poi = element;
					});
					$rootScope.$broadcast("wf.nav-menu", "show");
					//console.log("info.poi:", element);
				}
			});
		}

		$scope.$on("wf.map.ready", function (event) {
			console.debug("INFO:map.ready");
			checkRouteParams();
		});
		$scope.onViewLoad = function(){
			dragscroll.reset();
		};
		$timeout(function () {
			checkRouteParams();
		}, 10);
	}
]);

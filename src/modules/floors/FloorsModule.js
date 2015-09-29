var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
	'$scope', 
	'wfangular3d', 
	'FloorSrv', 
	function($scope, wayfinder, FloorSrv) 
	{
		$scope.floors = {};
		$scope.activeFloor = {};
		$scope.kioskNode = {};
		$scope.activeLanguage = {};

		$scope.getFloor = function() {
			$scope.kioskNode = wayfinder.getKioskNode();
			console.log("getKioskNode="+$scope.kioskNode);
		}

		$scope.$on('wf.data.loaded', function(event, data)
		{
			$scope.$apply(function () 
			{
				$scope.activeLanguage = FloorSrv.getLanguage();
				$scope.floors = wayfinder.building.getFloors();
			});
		});
	}
]);

floorsModule.service('FloorSrv', function(LanguagesSrv) 
{
	this.getLanguage = function() 
	{
		return LanguagesSrv.getLanguage();
	}
});
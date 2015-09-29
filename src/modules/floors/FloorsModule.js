var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
	'$scope', 
	'wfangular3d', 
	'FloorSrv', 
	function($scope, wayfinder, FloorSrv) 
	{
		$scope.floors = {};

		$scope.activeLanguage = {};

		$scope.$on('wf.data.loaded', function(event, data)
		{
			$scope.$apply(function () 
			{
				$scope.activeLanguage = FloorSrv.getLanguage();
				console.log("floors_lang:"+$scope.activeLanguage);
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
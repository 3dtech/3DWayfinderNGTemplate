// Declare app level module which depends on filters, and services
var wayfinderApp = angular.module('app', [
	'ngRoute',
	'wfangular',
	'wf.languages',
	'wf.floors'//,
	// 'wf.zoom' // all modules go here, and into separate files and into the folder modules/<modulename>
]);

wayfinderApp.run(['wfangular3d', function(wayfinder) {
	WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
	wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
	wayfinder.open("05d899e005f24a45a7b17b7d500a24d8");
}]);

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
var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
	'$scope', 
	'wfangular3d', 
	'LanguagesSrv', 
	function($scope, wayfinder, LanguagesSrv) 
	{
		$scope.languages = {};
		$scope.activeLanguage = {};

		$scope.getLanguage = function() 
		{
			$scope.activeLanguage = wayfinder.getLanguage();
			LanguagesSrv.setLanguage($scope.activeLanguage);
			console.log("activeLanguage: "+$scope.activeLanguage);
		}

		$scope.setLanguage = function(language) 
		{
			console.log("setLanguage("+language+")");
			LanguagesSrv.setLanguage(language);
			wayfinder.setLanguage(language);
			$scope.activeLanguage = language;
		}

		$scope.$on('wf.data.loaded', function(event, data)
		{
			$scope.$apply(function () 
			{
				$scope.activeLanguage = wayfinder.getLanguage();
				$scope.languages = wayfinder.getLanguages();
				LanguagesSrv.setLanguages($scope.languages);
				LanguagesSrv.setLanguage($scope.activeLanguage);
				console.log("langSrv:activeLanguage="+LanguagesSrv.getLanguage());
			});
		});
	}
]);

languagesModule.service('LanguagesSrv', function() 
{
	var activeLanguage = {};
	var wfLanguages = {};

	return {
		getLanguage: function() 
		{
			return activeLanguage;
		},
		setLanguage: function(language) 
		{
			activeLanguage = language;
		},
		getLanguages: function() 
		{
			return wfLanguages;
		},
		setLanguages: function(languages) 
		{
			wfLanguages = languages;
		}
	}
});

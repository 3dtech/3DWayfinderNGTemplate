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

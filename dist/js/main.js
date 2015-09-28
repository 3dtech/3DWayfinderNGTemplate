// Declare app level module which depends on filters, and services
angular.module('app', [
	'wfangular',
	'wf.languages'
])
.run(['wfangular3d', function(wayfinder) {
	WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
	wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
	wayfinder.open();
}]);
angular.module('wf.languages', ['wfangular'])
.controller('LanguagesController', ['$scope', 'wfangular3d', function($scope, wayfinder) {
		$scope.languages = {};

		$scope.$on('wf.data.loaded', function(event, data){
			$scope.$apply(function () {
				$scope.languages = wayfinder.getLanguages();
			});
		});
}]);
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
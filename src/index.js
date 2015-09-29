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

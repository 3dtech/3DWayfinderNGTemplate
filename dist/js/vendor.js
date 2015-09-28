var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', ['$rootScope', function($rootScope) {
  var wf = new Wayfinder3D();
  wf.onDataLoaded = function(){
  	$rootScope.$broadcast('wf.data.loaded', []);
  }
  return wf;
}])
.run(['wfangular3d', function(wayfinder) {
	WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
	wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
	wayfinder.open();
}]);
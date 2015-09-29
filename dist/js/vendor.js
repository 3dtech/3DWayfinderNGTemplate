var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', ['$rootScope', function($rootScope) {
  var wf = new Wayfinder3D();
  wf.onDataLoaded = function(){
  	$rootScope.$broadcast('wf.data.loaded', []);
  }
  return wf;
}]);
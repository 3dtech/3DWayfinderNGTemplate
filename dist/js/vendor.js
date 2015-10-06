var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', ['$rootScope', function($rootScope) {
  var wf = new Wayfinder3D();
  wf.onDataLoaded = function(){
  	$rootScope.$broadcast('wf.data.loaded', []);
  }
  return wf;
}]);

wfangular.filter('wfCurrentLanguage', ['wfangular3d', function(wayfinder) {
  return function(input) {
  	if(input && typeof input === "object"){
  		if(input[wayfinder.getLanguage()])
    		return input[wayfinder.getLanguage()];
    	else if(input["translations"][wayfinder.getLanguage()])
    		return input["translations"][wayfinder.getLanguage()];
    	else
    		return input;
  	}
  	else {
  		return input;
  	}
  };
}]);
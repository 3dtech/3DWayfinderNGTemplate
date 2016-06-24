//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('InfoController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'wayfinderService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, $routeParams, wayfinderService, wayfinder) {
        for (var i in wayfinderService.getPOIs()) {
            if (wayfinderService.getPOIs()[i].id == $routeParams.id)
                $scope.poi = wayfinderService.getPOIs()[i];
        };
        console.log("wayfinderService.getPOIs():", wayfinderService.getPOIs());
        console.log("InfoController.poi", $scope.poi, $routeParams.id);

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.hasDescription = function(poi) {
            if (!poi) return 0;
            return poi.getDescription(wayfinder.getLanguage()) ? 1 :
                0;
        };
    }
]);

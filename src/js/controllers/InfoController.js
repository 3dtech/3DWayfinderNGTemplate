//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('InfoController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'wfService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, $routeParams, wfService, wayfinder) {
        $scope.poi = null;
        console.log("wfService.getPOIs():", wfService.getPOIs());
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

        $scope.getBackgroundImage = function(poi) {
            if (poi == null) return;
            console.debug("info.getBackgroundImage:", poi.backgroundImage);
            return 'url(' + poi.backgroundImage + ')';
        };

        $timeout(function() {
            if (!$routeParams) return;
            console.debug("info.$routeParams:", $routeParams);
            var pois = wfService.getPOIs();
            for (var i in pois) {
                console.debug("poi.id", pois[i].id, "==", $routeParams.id, "?", pois[i].id == $routeParams.id);
                if (pois[i].id == $routeParams.id)
                    $scope.poi = pois[i];
            };
        }, 10);
    }
]);

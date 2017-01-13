var zoomModule = angular.module('wf.zoom', ['wfangular']);

zoomModule.controller('ZoomCtrl', [
    '$scope',
    'wfangular',
    function($scope, wayfinder) {
        $scope.zoomIn = function() {
            wayfinder.zoomIn();
            console.log("zoomIn()");
        }

        $scope.zoomOut = function() {
            wayfinder.zoomOut();
            console.log("zoomOut()");
        }
    }
]);

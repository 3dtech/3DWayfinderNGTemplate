//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller( 'MapControlsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wfService',
    'wfangular3d',
    function ( $rootScope, $scope, $timeout, wfService, wayfinder ) {
        $scope.floors = [];
        $scope.shoprtcuts = [];
        $scope.activeFloor = null;

        $scope.changeFloor = function (floor) {
            wayfinder.showFloor(floor);
        };

        $scope.$on('wf.floor.change', function( event, floor) {
            $timeout(function() {
                activeFloor = wfService.getActiveFloor();
            },10);
        });

        $scope.$on('wf.data.loaded', function() {
            $timeout(function() {
                $scope.floors = wfService.getFloors();
                $scope.shortcuts = wfService.getShortcuts();
            }, 100);
        });
    }
] );

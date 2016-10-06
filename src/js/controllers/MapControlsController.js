//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('MapControlsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wfService',
    'wfangular3d',
    function ($rootScope, $scope, $timeout, wfService, wayfinder) {
        $scope.floors = wfService.data.floors;
        $scope.shortcuts = wfService.data.shortcuts;
        $scope.activeFloor = wfService.data.activeFloor;
        console.debug("wfService.data:", wfService.data);

        $scope.changeFloor = function (floor) {
            wayfinder.showFloor(floor);
        };

        $scope.$on('wf.floor.change', function (event, floor) {
            $timeout(function () {
                activeFloor = wfService.getActiveFloor();
            }, 10);
        });

        $scope.$watch("floors", function (oldVal, newVal) {
            console.debug("floors:", oldVal, "->", newVal);
            if (!!newVal)
                $scope.$apply();
        });

        $scope.$watch("shortcuts", function (oldVal, newVal) {
            console.debug("shortcuts:", oldVal, "->", newVal);
            if (!!newVal)
                $scope.$apply();
        });

        $timeout(function () {
            if (!!$scope.floors && !!$scope.shortcuts) {
                console.debug("checking for floors and shortcuts:", $scope.floors, $scope.shortcuts);
                $scope.$apply();
            }
        }, 1000);


        $scope.$on("wfService.data.loaded", function () {
            console.debug("wfService.data.loaded");
            $scope.$apply(function () {
                if (!(!!$scope.floors))
                    $scope.floors = wfService.data.floors;
                if (!(!!$scope.shortcuts))
                    $scope.shortcuts = wfService.data.floors;
            });
        });
    }
]);

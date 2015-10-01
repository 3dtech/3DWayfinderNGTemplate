var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
    '$scope',
    'wfangular3d',
    'FloorSrv',
    'LanguagesSrv',
    function($scope, wayfinder, FloorSrv, LanguagesSrv) {
        $scope.buildingFloors = {};
        $scope.activeFloor = {};
        $scope.kioskNode = {};
        $scope.activeLanguage = {};

        $scope.$watch(
            function() {
                return LanguagesSrv.getLanguage()
            },
            function(newValue, oldValue) {
                $scope.activeLanguage = FloorSrv.getLanguage();
                console.log("watch.getLanguage(" + FloorSrv.getLanguage() + ")");
            });

        $scope.getFloor = function() {
            $scope.kioskNode = wayfinder.getKioskNode();
            console.log("getKioskNode=" + $scope.kioskNode);
            console.log("floorActiveLanguage:" + $scope.activeLanguage);
        }

        $scope.setActiveFloor = function(floor) {
            $scope.activeFloor = floor;
        }

        $scope.getActiveFloor = function() {
            return $scope.activeFloor;
        }

        $scope.setFloor = function(floor) {
            $scope.activeFloor = floor;
            wayfinder.showFloor(floor);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                $scope.activeLanguage = FloorSrv.getLanguage();
                $scope.kioskNode = wayfinder.getKioskNode();
                $scope.buildingFloors = wayfinder.building.getFloors();
            });
        });
    }
]);

floorsModule.service('FloorSrv', function(LanguagesSrv) {
    this.getLanguage = function() {
        return LanguagesSrv.getLanguage();
    }
});

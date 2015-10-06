var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.buildingFloors = [];
        $scope.activeFloor = {};
        $scope.kioskNode = {};
        $scope.activeLanguage = {};
        
        $scope.floorsOrdered = function() {
            var orderedFloors = [];
            for (var i = $scope.buildingFloors.length - 1; i >= 0; i--) {
                orderedFloors.push($scope.buildingFloors[i]);
            };
            return orderedFloors;
        }

        $scope.$watch(
            function() {
                return wayfinder.getLanguage()
            },
            function(newValue, oldValue) {
                $scope.activeLanguage = wayfinder.getLanguage();
                console.log("watch.getLanguage(" + wayfinder.getLanguage() + ")");
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
                $scope.activeLanguage = wayfinder.getLanguage();
                $scope.kioskNode = wayfinder.getKioskNode();
                var arr = [];
                for (var key in wayfinder.building.getFloors()) {
                    // add hasOwnPropertyCheck if needed
                    arr.push(wayfinder.building.getFloors()[key]);
                  }
                for (var i = arr.length - 1; i >= 0; i--) {
                    $scope.buildingFloors.push(arr[i]);
                };
                console.log("buildingFloors:", $scope.buildingFloors);
            });
        });
    }
]);

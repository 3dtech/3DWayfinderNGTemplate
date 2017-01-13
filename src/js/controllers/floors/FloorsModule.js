var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
  '$scope',
  'wfangular',
  function($scope, wayfinder) {
    $scope.buildingFloors = {};
    $scope.orderedFloors = [];
    $scope.activeFloor = {};
    $scope.kioskNode = {};
    $scope.activeLanguage = {};
    $scope.activeIndex = 0;
    $scope.floorNames = [];
    $scope.showFloors = false;

    $scope.activateIndex = function($index) {
      $scope.activeIndex = $index;
    }

    $scope.floorsOrdered = function() {
      var orderedFloors = [];
      var arr = []
      var floors = wayfinder.building.getFloors();
      if (!floors) return;
      for (var key in floors) {
        arr.push(floors[key]);
        orderedFloors.push({});
      };
      for (var i = arr.length - 1; i >= 0; i--) {
        orderedFloors[(arr[i].index - 1)] = arr[i];
      };
      if (arr.length > 1) $scope.showFloors = true;
      return orderedFloors;
    };

    $scope.$watch(
      function() {
        return wayfinder.getLanguage()
      },
      function(newValue, oldValue) {
        $scope.activeLanguage = wayfinder.getLanguage();
      });

    $scope.getFloor = function() {
      $scope.kioskNode = wayfinder.getKioskNode();
    };

    $scope.setActiveFloor = function(floor) {
      $scope.activeFloor = floor;
    };

    $scope.getActiveFloor = function() {
      return $scope.activeFloor;
    };

    $scope.setFloor = function(floor) {
      $scope.activeFloor = floor;
      wayfinder.showFloor(floor);
    };

    function getDefaultFloor() {
      return wayfinder.getKioskNode().floor;
    };

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        $scope.setActiveFloor(getDefaultFloor());
      };
    });

    $scope.$on('wf.floor.change', function(event, floor) {
      $scope.$apply(function() {
        $scope.activeFloor = floor;
      });
    });

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {
        getDefaultFloor();
        $scope.activeLanguage = wayfinder.getLanguage();
        $scope.kioskNode = wayfinder.getKioskNode();
        $scope.buildingFloors = wayfinder.building.getFloors();
        $scope.orderedFloors = $scope.floorsOrdered();
      });
    });
  }
]);

floorsModule.directive('buttonWidth', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var maxWidth = 0;
      if (scope.$last === true) {
        scope.$emit('lastButton');
      }
      scope.$watch('lastButton', function() {
        var allButtons = $(element).find('floor-button');
        //check the maximum width of element
        angular.forEach(allButtons, function(ele, ind) {
          //below code will find maxWidth
          maxWidth = ele.innerWidth > maxWidth ? ele.innerWidth : maxWidth;
        });
        allButtons.css('width', maxWidth)
      });
    }
  }
})

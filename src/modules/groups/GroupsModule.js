var groupsModule = angular.module('wf.groups', ['wfangular']);

groupsModule.controller('HotGroupCtrl', [
  '$scope',
  'wfangular3d',
  function($scope, wayfinder) {
    $scope.hotGroups = [];
    $scope.imageURLs = [];

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {
        for (var key in wayfinder.getPOIGroups()) {
          if (wayfinder.getPOIGroups()[key].getShowInTopMenu()) {
            /*$scope.hotGroups.push(groups[key]);*/
            $scope.hotGroups.push(wayfinder.getPOIGroups()[key]);
          }
        }
        for (var i = $scope.hotGroups.length - 1; i >= 0; i--) {
          $scope.imageURLs.push(WayfinderAPI.getURL("images", "get", $scope.hotGroups[i].getImageID()));
        }
      });
    });
  }
])

groupsModule.controller('GroupsCtrl', [
  '$scope',
  '$timeout',
  'wfangular3d',
  function($scope, $timeout, wayfinder) {
    $scope.alphabet = "abcdefghijklmnopqrstuvwõäöüxyz".split("");

    $scope.poiObjects = [];

    $scope.groups = [];
    $scope.textColor = 0;

    $scope.collapsed = [];
    $scope.activeLetter = "";

    $scope.filterText = {};
    $scope.filterText.names = {};
    $scope.filterText.names.translations = {};
    $scope.filterText.names.translations[wayfinder.getLanguage()] = "";

    // Instantiate these variables outside the watch
    var tempFilterText = '',
      filterTextTimeout;

    $scope.$watch('searchText', function(val) {
      if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

      tempFilterText = val;
      filterTextTimeout = $timeout(function() {
        $scope.filterText.names.translations[wayfinder.getLanguage()] = tempFilterText;
      }, 250); // delay 250 ms
    });

    /*$scope.$on("wf.keyboard.change", function(val) {
      $scope.$apply(function(){
        $scope.filterText.names.translations[wayfinder.getLanguage()] = val;
      });
    });*/

    function setDefaults() {
      $scope.filterText.names.translations[wayfinder.getLanguage()] = "";
      $scope.activeLetter = "";
      for (var i = $scope.collapsed.length - 1; i >= 0; i--) {
        $scope.collapsed[i] = false;
      }
    }

    $scope.criteriaMatch = function(criteria) {
      if (criteria == "") return 0;
      return function(item) {
        var name = item.names.translations[wayfinder.getLanguage()].toLowerCase().charAt(0);
        return name === criteria;
      }
    }
    $scope.checkForPOIs = function(criteria) {
      if (criteria == "") return 0;
      var poiCntr = 0;
      var pois = wayfinder.getPOIsArray();
      for (var i = pois.length - 1; i >= 0; i--) {
        if ((criteria == pois[i].names.translations[wayfinder.getLanguage()].toLowerCase().charAt(0)) &&
          (pois[i].showInMenu)) {
          poiCntr++;
        };
      };
      return poiCntr;
    }

    $scope.startsWith = function(item) {
      return item.getName(wayfinder.getLanguage()).charAt(0);
    }

    $scope.setActiveLetter = function(letter) {
      if (!$scope.checkForPOIs(letter)) return 0;
      $scope.activeLetter = letter;
      return 1;
    }

    $scope.getActiveLetter = function() {
      return $scope.activeLetter;
    }

    $scope.getLanguage = function() {
      console.log("getLanguage():",wayfinder.getLanguage());
      return wayfinder.getLanguage();
    }

    $scope.expand = function(group) {
      group.show = !group.show;
    }

    $scope.getColor = function(group) {
      //Function to convert hex format to a rgb textColor
      if (!group) return;
      var rgb = group.getColor();
      var r = rgb["r"];
      var g = rgb["g"];
      var b = rgb["b"];
      var a = rgb["a"];
      $scope.textColor = "#" + r.toString(16).slice(-2) + g.toString(16).slice(-2) + b.toString(16).slice(-2);
      return $scope.textColor;
    }

    $scope.getColorRGBA = function(group) {
      //Function to convert hex format to a rgb textColor
      if (!group) return;
      var rgb = group.getColor();
      var r = rgb["r"];
      var g = rgb["g"];
      var b = rgb["b"];
      var a = rgb["a"];
      var textColor = "rgba(" + parseInt(r.toString(10) * 255) + "," + parseInt(g.toString(10) * 255) + "," + parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(10) * 255) + ")";
      return textColor;
    }

    $scope.$watch(
      function() {
        return wayfinder.getLanguage();
      },
      function(newValue, oldValue) {
        $scope.activeLetter = "";
      });

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        setDefaults();
      };
    });

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {
        var arr = [];
        for (var key in wayfinder.getPOIGroups()) {
          // add hasOwnPropertyCheck if needed
          if (wayfinder.getPOIGroups()[key].showInMenu == "1") {
            arr.push(wayfinder.getPOIGroups()[key]);
            $scope.collapsed.push(false);
          };
        };
        for (var i = arr.length - 1; i >= 0; i--) {
          $scope.groups.push(arr[i]);
          var pois = arr[i].getPOIs();
          console.log("arr[i]:", arr[i]);
          for (var j in pois) {
            if (pois[j].showInMenu) {
              console.log("arr[i].poi:", pois[j]);
              $scope.poiObjects.push(arr[i].getPOIs()[j]);
            };
          };
        };
      });
    });
  }
]);

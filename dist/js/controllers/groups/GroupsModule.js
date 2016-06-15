var groupsModule = angular.module('wf.groups', ['wfangular']);

groupsModule.controller('HotGroupCtrl', [
  '$scope',
  '$timeout',
  'wfangular3d',
  function($scope, $timeout, wayfinder) {
    $scope.hotGroups = [];
    $scope.imageURLs = [];

    $scope.$on('wf.data.loaded', function(event, data) {
      $timeout(function() {
        var groups = wayfinder.getPOIGroups();
        for (var key in groups) {
          if (groups[key].getShowInTopMenu()) {
            /*$scope.hotGroups.push(groups[key]);*/
            $scope.hotGroups.push(groups[key]);
          }
        }
        for (var i = $scope.hotGroups.length - 1; i >= 0; i--) {
          $scope.imageURLs.push(WayfinderAPI.getURL("images", "get", $scope.hotGroups[i].getImageID()));
        }
      }, 10);
    });
  }
])

groupsModule.controller('GroupsCtrl', [
  '$rootScope',
  '$scope',
  '$timeout',
  'wfangular3d',
  function($rootScope, $scope, $timeout, wayfinder) {
    $scope.atoz = [];

    $scope.poiObjects = [];

    $scope.groups = [];
    $scope.floorPOIs = [];
    $scope.activeGroup = "";
    $scope.textColor = 0;

    $scope.collapsedGroup = [];
    $scope.collapsedFloor = [];
    $scope.activeLetter = "";

    $scope.filterText = {};
    $scope.filterText.names = {};
    $scope.filterText.names.translations = {};
    $scope.filterText.names.translations[wayfinder.getLanguage()] = "";

    // Instantiate these variables outside the watch
    var tempFilterText = '',
      filterTextTimeout;

    /*$scope.$on("wf.keyboard.change", function(val) {
      $scope.$apply(function(){
        $scope.filterText.names.translations[wayfinder.getLanguage()] = val;
      });
    });*/


    $scope.setActiveGroup = function(group) {
      $scope.activeGroup = group;
    };

    $scope.getActiveGroup = function() {
      return $scope.activeGroup;
    };

    function setDefaults() {
      $scope.filterText.names.translations[wayfinder.getLanguage()] = "";
      $scope.activeLetter = "";
      $scope.activeGroup = "";
      for (var i = $scope.collapsedGroup.length - 1; i >= 0; i--) {
        $scope.collapsedGroup[i] = false;
      }
      for (var i = $scope.collapsedFloor.length - 1; i >= 0; i--) {
        $scope.collapsedFloor[i] = false;
      }
    };

    $scope.criteriaMatch = function(criteria) {
      if (criteria == "") return 0;
      return function(item) {
        var name = item.names.translations[wayfinder.getLanguage()].toLowerCase().charAt(0);
        return name === criteria;
      }
    };

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
    };

    $scope.startsWith = function(item) {
      return item.getName(wayfinder.getLanguage()).charAt(0);
    };

    $scope.setActiveLetter = function(letter) {
      if (!$scope.checkForPOIs(letter)) return 0;
      $scope.activeLetter = letter;
      return 1;
    };

    $scope.getActiveLetter = function() {
      return $scope.activeLetter;
    };

    $scope.getLanguage = function() {
      return wayfinder.getLanguage();
    };

    $scope.expand = function(group) {
      group.show = !group.show;
    };

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
    };

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
    };

    $scope.getGroupPOIs = function(group) {
      var arr = [];
      for (var i in group.getPOIs()) {
        if (group.getPOIs()[i].showInMenu) arr.push(group.getPOIs()[i]);
      };
      if (arr.length > 0) return arr;
      return false;
    };

    $scope.getPOIGroupImage = function(poi) {
      if (!poi) return false;
      if (poi.getGroups()[0] && poi.getGroups()[0].imageID) return WayfinderAPI.getURL("images", "get", [poi.getGroups()[0].imageID]);
    };

    function extractGroups() {
      var arr = [];
      for (var key in wayfinder.getPOIGroups()) {
        // add hasOwnPropertyCheck if needed
        if (wayfinder.getPOIGroups()[key].showInMenu == "1") {
          $scope.collapsedGroup.push(false);
          arr.push(wayfinder.getPOIGroups()[key]);
        };
      };
      return arr;
    };

    function extractPOIs() {
      var arr = [];
      for (var i = wayfinder.getPOIsArray().length - 1; i >= 0; i--) {
        if (wayfinder.getPOIsArray()[i].showInMenu) arr.push(wayfinder.getPOIsArray()[i]);
      };
      return arr;
    };

    function extractPOIsByFloor() {
      var arr = [];
      for (var i in wayfinder.building.floors) {
        $scope.collapsedFloor.push(false);
        arr.push(wayfinder.building.floors[i]);
      }
      return arr;
    };

    function getAtoZLetters() {
      var arr = [];
      var arr1 = [];
      var pois = wayfinder.getPOIs();
      for (var i in pois) {
        if (pois[i].showInMenu) {
          if (arr.indexOf(pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0)) == -1) {
            //console.log("letter", pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0), "exists? :", (arr.indexOf(pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0)) == -1));
            arr.push(pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0));
          }
        }
      }
      for (var key in arr) arr1.push({name:arr[key]});
      return arr1;
    };

    $scope.$watch('searchText', function(val) {
      if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

      tempFilterText = val;
      filterTextTimeout = $timeout(function() {
        $scope.filterText.names.translations[wayfinder.getLanguage()] = tempFilterText;
      }, 250); // delay 250 ms
    });

    $rootScope.$on("wf.search-text.change", function(event, val) {
      console.log("search-event:", val);
      $rootScope.searchText = val;
      if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

      tempFilterText = val;
      filterTextTimeout = $timeout(function() {
        $scope.filterText.names.translations[wayfinder.getLanguage()] = tempFilterText;
      }, 10); // delay 250 ms
    });

    $scope.$watch("collapsedGroup", function(newVal, oldVal) {
      //console.log("collapsedGroup:", oldVal, "->", newVal);
    });

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
      $timeout(function() {
        $scope.groups = extractGroups();
        $scope.poiObjects = extractPOIs();
        $scope.floorPOIs = extractPOIsByFloor();
        $scope.atoz = getAtoZLetters();
      }, 250);
    });
  }
]);

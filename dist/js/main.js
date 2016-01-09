// Declare app level module which depends on filters, and services
var wayfinderApp = angular.module('app', [
  'ngSanitize',
  'wfangular',
  'wf.languages',
  'wf.floors',
  'wf.groups',
  'wf.keyboard',
  'wf.tabs',
  'wf.zoom' // all modules go here, and into separate files and into the folder modules/<modulename>
]);

wayfinderApp.run(['wfangular3d', '$rootScope', '$http', function(wayfinder, $rootScope, $http) {
  //WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
  wayfinder.options.apiLocation="http://api.3dwayfinder.com/";
  wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
  wayfinder.open();
}]);

// -------------------------------------------
// --------------- Controllers ---------------
// -------------------------------------------

wayfinderApp.controller('WayfinderCtrl', [
  '$scope',
  '$uibModal',
  '$log',
  '$timeout',
  '$rootScope',
  '$sce',
  '$http',
  'wfangular3d',
  'tabsService',
  function($scope, $uibModal, $log, $timeout, $rootScope, $sce, $http, wayfinder, tabsService) {
    var kbLayoutEt = {
      "name": "Estonian",
      "local_name": "Eesti",
      "lang": "et",
      "keys": {
        "default": [
          ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
            "key": "&#171; Bksp",
            "action": ["backspace"],
            "cls": "key2x"
          }],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\u00FC", "\u00F5"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l", "\u00F6", "\u00E4", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ]
      }
    };
    var kbLayoutRu = {
      "name": "Russian",
      "local_name": "Ð ÑƒÑÑÐºÐ¸Ð¹",
      "lang": "ru",
      "keys": {
        "default": [
          [{
            "key": "en",
            "action": ["change_keyset", "en"],
            "cls": "change_layout"
          }, "\u0451", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
            "key": "&#171; Bksp",
            "action": ["backspace"],
            "cls": "key2x"
          }],
          ["\u0439", "\u0446", "\u0443", "\u043A", "\u0435", "\u043D", "\u0433", "\u0448", "\u0449", "\u0437", "\u0445", "\u044A", "\\"],
          ["\u0444", "\u044B", "\u0432", "\u0430", "\u043F", "\u0440", "\u043E", "\u043B", "\u0434", "\u0436", "\u044D", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["\u044F", "\u0447", "\u0441", "\u043C", "\u0438", "\u0442", "\u044C", "\u0431", "\u044E", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ],
        "en": [
          [{
            "key": "ru",
            "action": ["change_keyset", "default"],
            "cls": "change_layout"
          }, "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
            "key": "&#171; Bksp",
            "action": ["backspace"],
            "cls": "key2x"
          }],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\\"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ]
      }
    };
    var kbLayoutEn = {
      "name": "English",
      "keyboard": "US International",
      "local_name": "English",
      "lang": "en",
      "keys": {
        "default": [
          ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
            "key": "&#171; Bksp",
            "action": ["backspace"],
            "cls": "key2x"
          }],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          ["z", "x", "c", "v", "b", "n", "m", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ],
        "shift": [
          ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", {
            "key": "&#171; Bksp",
            "action": "backspace",
            "cls": "key2x"
          }],
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L", {
            "key": "Enter",
            "action": ["submit"],
            "cls": "key3x"
          }],
          [{
            "key": "Shift",
            "action": ["change_keyset", "default"],
            "cls": "key2x active"
          }, "Z", "X", "C", "V", "B", "N", "M", "\u002E", "\u005F", "\u002D", "\u0040"],
          [{
            "key": " ",
            "cls": "key_spacebar"
          }]
        ]
      }
    };

    var searchKeyboard = new Keyboard($(".search-keyboard"), wayfinder.getLanguage());


    searchKeyboard.addLayout('et', kbLayoutEt);
    searchKeyboard.addLayout('ru', kbLayoutRu);
    searchKeyboard.addLayout('en', kbLayoutEn);

    searchKeyboard.setOutput($("#search-bar"));

    searchKeyboard.cbOnChange = function(val) {
      console.log("me:", val);
      $(".search-keyboard").trigger("keypressed");
      $rootScope.$broadcast("wf.keyboard.change", val);
      //angular.element.Event('keyup');
    };

    $rootScope.$on("wf.language.change", function(event, language) {
      searchKeyboard.changeLayout(language);
    });

    searchKeyboard.construct();

    searchKeyboard.show();

    $scope.animationsEnabled = true;

    $scope.bold = ['\<b\>', '\<\/b\>'];

    var modalInstance;

    var lastTouch = -1;
    lastTouch = (new Date()).getTime();
    var maxInactivityTime = 3000;

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        $scope.showYAH();
      }
    });

    $scope.$on('wf.data.loaded', function(event, asi) {
      if (wayfinder.settings.data["kiosk.max-inactivity"]) {
        maxInactivityTime = parseInt(wayfinder.settings.data["kiosk.max-inactivity"], 10) * 1000;
        wayfinder.setKiosk("394");

      };
    });

    $scope.ShowPath = function(poi) {
      wayfinder.showPath(poi.getNode(), poi);
    };

    $scope.showGroup = function(group) {
      var pois = [];
      var kioskFloor = wayfinder.getKioskNode().floor;
      var kioskFloorName = kioskFloor.getName(wayfinder.getLanguage());
      var kioskFloorPOIs = kioskFloor.getPOIs();
      var poiHasGroup = 0;

      for (var key1 in kioskFloorPOIs) {
        var kioskFloorPOIsPOIGroups = kioskFloorPOIs[key1].getGroups();
        for (var key2 in kioskFloorPOIsPOIGroups) {
          if (kioskFloorPOIsPOIGroups[key2].getName(wayfinder.getLanguage()) === group.getName(wayfinder.getLanguage())) {
            poiHasGroup = 1;
          };
        };
        if (poiHasGroup) {
          pois.push(kioskFloorPOIs[key1]);
          poiHasGroup = 0;
        };
      };
      console.log(pois);
      if (pois.length == 0) {
        console.log("no pois on kiosk floor");
        pois = group.getPOIs();
        console.log("showing way to nearest in whole building");
      };
      console.log(pois);
      if (pois == []) {
        console.log("nearest not found");
        return;
      };
      //var nearest = wayfinder.getNearestPOI(wayfinder.getKiosk(), group.getPOIs());
      var nearest = wayfinder.getNearestPOI(wayfinder.getKiosk(), pois);

      wayfinder.showPath(nearest.getNode());
    };

    function hideScreensaver() {
      $rootScope.$broadcast("app.screensaving", false);
      // here reset all the local variables, like menu items and stuff?jah
    };

    function showScreensaver() {
      $rootScope.$broadcast("app.screensaving", true);
      // show modal, mõttekam oleks vist mitte modal'it kasutada, sest sisu on pidevalt sama
    };

    function checker() {
      console.log("Checker! time since lastTouch", (((new Date()).getTime() - lastTouch) / 1000), "sec");
      var time = (new Date()).getTime();
      if (time - lastTouch > maxInactivityTime) {
        if (lastTouch > -1) {
          onTimeout();
        } else {
          $timeout(checker, maxInactivityTime);
        };
      } else {
        $timeout(checker, maxInactivityTime - (time - lastTouch));
      };
    };

    function onTimeout() {
      console.log("onTimeout");
      lastTouch = -1; //Disables timeouting until somebody has touched
      wayfinder.statistics.onSessionEnd();
      wayfinder.restoreDefaultState();
      showScreensaver(); //näitame seda modalit
      console.log(lastTouch);
    };

    $scope.trigger = function() {
      console.log("Trigger! time since lastTouch", (((new Date()).getTime() - lastTouch) / 1000), "sec");
      //reset
      if (lastTouch == -1) {
        //first click in a while
        hideScreensaver();
        wayfinder.statistics.onSessionStart();
        $timeout(checker, maxInactivityTime);
      };
      lastTouch = (new Date()).getTime();
    };

    $timeout(checker, maxInactivityTime);

    //$("body").hammer().on('touch', trigger);

    $scope.showYAH = function() {
      wayfinder.showKiosk();
    };

    $scope.cbResizeCtrl = function() {
      wayfinder.resize();
    };

    $scope.getGUITranslation = function(key, params) {
      if (params) return wayfinder.translator.get(key);
      return wayfinder.translator.get(key, params);
    };


    $scope.$on('wf.language.change', function(key) {});

    $scope.$on('wf.data.loaded', function() {
      $scope.$apply(function() {});
    });

    $scope.trustedOpenTimes = function(str) {};

    $scope.$on('app.screensaving', function(event, screensaving) {
      $scope.screensaving = screensaving;
    })

    $scope.$on('wf.zoom.change', function(event, zoom) {
      if (!$scope.screensaving && lastTouch > -1) {
        $scope.trigger();
      }
    });

    $scope.$on("wf.poi.click", function(event, poi) {
      console.log(typeof modalInstance, modalInstance);
      if (!modalInstance) {
        modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modalContent.html',
          controller: 'ModalCtrl',
          backdrop: 'static',
          size: 'sm',
          resolve: {
            poi: function() {
              return poi;
            },
            language: function() {
              return wayfinder.getLanguage();
            },
            wayfinder: function() {
              return wayfinder;
            }
          }
        });
        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
          modalInstance = false;
        });
      }
    })
  }
]);

wayfinderApp.controller('ModalCtrl', [
  '$rootScope',
  '$scope',
  '$uibModalInstance',
  'poi',
  'language',
  'wayfinder',
  'tabsService',
  function($rootScope, $scope, $uibModalInstance, poi, language, wayfinder, service) {

    $scope.screensaving = false;
    $scope.poi = poi;
    $scope.language = language;

    $scope.close = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.ShowPath = function() {
      $scope.close();
      wayfinder.showPath($scope.poi.getNode());
    };

    $scope.getColor = function(group) {
      //Function to convert hex format to a rgb textColor
      if (!group) return;
      var rgb = group.getColor();
      var r = rgb["r"];
      var g = rgb["g"];
      var b = rgb["b"];
      var a = rgb["a"];
      var textColor = "#" + r.toString(16).slice(-2) + g.toString(16).slice(-2) + b.toString(16).slice(-2);
      return textColor;
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

    $scope.getActiveTab = function() {
      return service.getActiveTab();
    };

    $scope.setActiveTab = function(tabName) {
      service.setActiveTab(tabName);
    };

    $scope.setTabContent = function(poi) {
      service.setTabContent(poi);
      $rootScope.$broadcast('wf.tab-content.change');
    };

    $scope.getTabContent = function() {
      return service.getTabContent();
    };

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        $scope.close();
      };
    });

    $scope.$on("wf.poi.click", function(event, poi) {
      wayfinder.pathComponent.clearPath();
      $scope.poi = poi;
    });
  }
]);

// ------------------------------------
// ----------- Filters ----------------
// ------------------------------------

wayfinderApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

wayfinderApp.filter('reverseArrayOnly', function() {
  return function(items) {
    if (!angular.isArray(items)) {
      return items;
    }
    return items.slice().reverse();
  };
});

wayfinderApp.filter('reverseObjects', function() {
  return function(items) {
    var arr = [];
    var reverseArr = [];
    for (var key in items) {
      // add hasOwnPropertyCheck if needed
      arr.push(items[key]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      reverseArr.push(arr[i]);
    };
    return reverseArr;
  }
})

wayfinderApp.filter('firstLetter', function() {
  return function(items, letter) {
    var filtered = [];
    var letterMatch = new RegExp(letter, 'i');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (letterMatch.test(item.name.substring(0, 1))) {
        filtered.push(item);
      }
    }
    return filtered;
  };
})

// ------------------------------------
// -------- Directives ----------------
// ------------------------------------

wayfinderApp.directive('resize', function($window) {
  return {
    restrict: 'AEC',
    scope: {
      cbResize: '&cbResize'
    },
    link: function(scope, element, attrs) {

      var w = element[0]
      scope.getWindowDimensions = function() {
        return {
          'h': w.clientHeight,
          'w': w.clientWidth
        };
      };

      scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;

        scope.style = function() {
          return {
            'height': (newValue.h - 10) + 'px',
            'width': (newValue.w - 10) + 'px'
          };
        };

      }, true);

      angular.element($window).bind('resize', function() {
        scope.$apply(function() {
          scope.cbResize();
        });
      });
    }
  }
});


wayfinderApp.directive('buttonWidth', function() {
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
});

wayfinderApp.directive("myStyle", function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var el = element[0],
        attr = el.getAttribute('style');

      el.setAttribute('style', attr);

      // We need to watch for changes in the style in case required data is not yet ready when compiling
      attrs.$observe('style', function() {
        attr = el.getAttribute('style');

        if (attr) {
          el.setAttribute('style', attr);
        }
      });
    }
  };
});

var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
  '$scope',
  'wfangular3d',
  function($scope, wayfinder) {
    $scope.buildingFloors = {};
    $scope.orderedFloors = [];
    $scope.activeFloor = {};
    $scope.kioskNode = {};
    $scope.activeLanguage = {};
    $scope.activeIndex = 0;
    $scope.floorNames = [];

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
            (pois[i].showInMenu)) 
        {
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
          if (wayfinder.getPOIGroups()[key].showInMenu == "1") 
          {
            arr.push(wayfinder.getPOIGroups()[key]);
            $scope.collapsed.push(false);
          };
        };
        for (var i = arr.length - 1; i >= 0; i--) {
          $scope.groups.push(arr[i]);
          for (var j in arr[i].getPOIs()) {
            if (arr[i].getPOIs()[j].showInMenu &&
                arr[i].getName("et") != "Büroo") 
            {
              $scope.poiObjects.push(arr[i].getPOIs()[j]);
            };
          };
        };
      });
    });
  }
]);

var keyboardModule = angular.module('wf.keyboard', ['wfangular', 'wf.languages']);

keyboardModule.controller('keyboardCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  'wfangular3d',
  function($scope, $rootScope, $http, wayfinder) {
    $http.get('layout.json').success(function(data) {
      $scope.layout = data;
    });

    $scope.keyPressed = function(value, action, $event) {
      $scope.someInput = value;
      $rootScope.$broadcast('keyPressed', $scope.someInput, action);
    };
  }
]);

keyboardModule.directive('myText', ['$rootScope', '$document', function($rootScope, $document) {
  return {
    link: function(scope, element, attrs) {
      $rootScope.$on('keyPressed', function(e, val, action) {
        var domElement = element[0];
        var triggerKeydown = function() {
          /*var e = angular.element.Event('keydown');*/
          var e = new window.KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            shiftKey: true
          });

          delete e.keyCode;
          Object.defineProperty(e, 'keyCode', {
            'value': 97
          });

          $document[0].dispatchEvent(e)
            /*e.which = keycode;
            element.trigger(e);*/
        };
            triggerKeydown();

        if (document.selection) {
          domElement.focus();
          var sel = document.selection.createRange();
          sel.text = val;
          domElement.focus();
        } else if (domElement.selectionStart || domElement.selectionStart === 0) {
          var startPos = domElement.selectionStart;
          var endPos = domElement.selectionEnd;
          var scrollTop = domElement.scrollTop;

          if (action === 'del') {
            if (startPos === endPos) {
              domElement.value = domElement.value.substring(0, startPos - 1) + domElement.value.substring(endPos, domElement.value.length);
              domElement.focus();
              domElement.selectionStart = startPos - 1;
              domElement.selectionEnd = startPos - 1;
            } else {
              domElement.value = domElement.value.substring(0, startPos) + domElement.value.substring(endPos, domElement.value.length);
              domElement.focus();
              domElement.selectionStart = startPos;
              domElement.selectionEnd = startPos;
            }

            domElement.scrollTop = scrollTop;
          } else if (action == 'enter') {
            triggerKeydown();
          } else {
            domElement.value = domElement.value.substring(0, startPos) + val + domElement.value.substring(endPos, domElement.value.length);
            domElement.focus();
            domElement.selectionStart = startPos + val.length;
            domElement.selectionEnd = startPos + val.length;
            domElement.scrollTop = scrollTop;
          }
        } else {
          domElement.value += val;
          domElement.focus();
        }
      });
    }
  }
}]);

keyboardModule.directive('myEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.myEnter);
        });

        event.preventDefault();
      }
    });
  };
});

var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
  '$scope',
  'wfangular3d',
  function($scope, wayfinder) {
    $scope.languages = {};
    $scope.activeLanguage = {};
    $scope.activeIndex = 1;

    $scope.activateIndex = function($index) {
      console.log("language clicked[", $index, "]");
      $scope.activeIndex = $index;
    }

    $scope.getLanguage = function() {
      $scope.activeLanguage = wayfinder.getLanguage();
      return $scope.activeLanguage;
    }

    $scope.getLanguages = function() {
      return wayfinder.getLanguages();
    }

    $scope.setLanguage = function(language) {
      console.info("setLanguage", language)
      wayfinder.setLanguage(language);
      $scope.activeLanguage = language;
    }

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        setDefaults();
      };
    });

    function setDefaults() {
      $scope.activeIndex = 1;
      $scope.activeLanguage = wayfinder.getLanguage();
    }

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {
        $scope.languages = wayfinder.getLanguages();
        $scope.activeLanguage = wayfinder.getLanguage();
      });
    });
  }
]);

var tabsModule = angular.module('wf.tabs', ['wfangular', 'ngAnimate', 'ui.bootstrap']);

tabsModule.controller('TabsCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  'wfangular3d',
  'tabsService',
  function($scope, $rootScope, $window, wayfinder, tabsService) {
    $scope.activeTab = "search";
    $scope.tabContent = null;
    $scope.activePOI = '';

    $scope.tabs = [{
      title: 'Search',
      content: 'Search',
      alignment: 'left'
    }, {
      title: 'aToZ',
      content: 'A-Z',
      alignment: 'left'
    }, {
      title: 'Topics',
      content: 'Topics',
      alignment: 'left'
    }];

    $scope.getActiveTab = function() {
      return $scope.activeTab;
    };

    $scope.setActiveTab = function(tab) {
      $scope.activeTab = tab;
    };

    $scope.getTabNameTranslation = function(key) {
      return wayfinder.translator.get(key);
    };

    $scope.setTabContent = function(poi) {
      console.log(poi);
      tabsService.setTabContent(poi);
      $scope.tabContent = poi;
    };

    $scope.hasDescription = function(poi) {
      if (!poi) return 0;
      return poi.getDescription(wayfinder.getLanguage()) ? 1 : 0;
    }

    $scope.getTabContent = function() {
      $scope.tabContent = tabsService.getTabContent();
    };

    $scope.setActivePOI = function(str) {
      $scope.activePOI = str;
    };

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        $scope.activeTab = "default";
        $scope.activePOI = '';
      };
    });

    $scope.$on('wf.tab-content.change', function() {
      console.log("tab-content.change captured! updating!");
      $scope.tabContent = tabsService.getTabContent();
      $scope.activeTab = tabsService.getActiveTab();
      console.log("new tabContent:", $scope.tabContent, "new activeTab:", $scope.activeTab);
    });

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {});
    });
  }
])

tabsModule.service('tabsService', function() {
  var activeTab = "search";
  var tabContent = {};

  return {
    getActiveTab: function() {
      return activeTab;
    },
    setActiveTab: function(tab) {
      activeTab = tab;
    },
    getTabContent: function() {
      return tabContent;
    },
    setTabContent: function(content) {
      tabContent = content;
    }
  };
})

var zoomModule = angular.module('wf.zoom', ['wfangular']);

zoomModule.controller('ZoomCtrl', [
    '$scope',
    'wfangular3d',
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

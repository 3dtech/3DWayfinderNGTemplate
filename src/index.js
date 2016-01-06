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
  WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
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

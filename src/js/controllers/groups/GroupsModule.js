//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('GroupsCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'groups',
    'wfangular',
    function($rootScope, $scope, $timeout, groups, wayfinder) {
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
        $scope.filterText.names.translations[wayfinder.getLanguage()] =
            "";

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
            $scope.filterText.names.translations[wayfinder.getLanguage()] =
                "";
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
                var name = item.names.translations[wayfinder.getLanguage()]
                    .toLowerCase().charAt(0);
                return name === criteria;
            }
        };

        $scope.checkForPOIs = function(criteria) {
            if (criteria == "") return 0;
            var poiCntr = 0;
            var pois = wayfinder.getPOIsArray();
            for (var i = pois.length - 1; i >= 0; i--) {
                if ((criteria == pois[i].names.translations[
                        wayfinder.getLanguage()].toLowerCase().charAt(
                        0)) &&
                    (pois[i].showInMenu)) {
                    poiCntr++;
                };
            };
            return poiCntr;
        };

        $scope.startsWith = function(item) {
            return item.getName(wayfinder.getLanguage()).charAt(0);
        };

        $scope.setLetterActive = function(letter) {
            if (letter.active) return 0;
            for (var i in $scope.atoz) {
                if ($scope.atoz[i].name == letter.name)
                    continue;
                else
                    $scope.atoz[i].active = false;
            }
            letter.active = true;
            $scope.activeLetter = letter.names;
            return 1;
        };

        $scope.getActiveLetter = function(letters) {
            var letter = {};
            for (var i in letters) {
                if (letters[i].active) {
                    letter = letters[i];
                    break;
                }
            }
            return letter;
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.expand = function(group) {
            group.show = !group.show;
        };

        $scope.$watch('searchText', function(val) {
            if (filterTextTimeout) $timeout.cancel(
                filterTextTimeout);

            tempFilterText = val;
            filterTextTimeout = $timeout(function() {
                $scope.filterText.names.translations[
                        wayfinder.getLanguage()] =
                    tempFilterText;
            }, 250); // delay 250 ms
        });

        $rootScope.$on("wf.search-text.change", function(event, val) {
            console.log("search-event:", val);
            $rootScope.searchText = val;
            if (filterTextTimeout) $timeout.cancel(
                filterTextTimeout);

            tempFilterText = val;
            filterTextTimeout = $timeout(function() {
                $scope.filterText.names.translations[
                        wayfinder.getLanguage()] =
                    tempFilterText;
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

        $timeout(function() {
            console.log("GroupsCtrl-wf.data.loaded");
            $scope.groups = groups.getGroups();
            $scope.poiObjects = groups.getPOIs();
            $scope.floorPOIs = groups.getFloorsPOIs();
            $scope.atoz = groups.getAtozLetters();
            $scope.activeLetter = groups.getActiveLetter();
        }, 10);
    }
]);

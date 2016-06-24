//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('AtozController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wayfinderService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, wayfinderService, wayfinder) {
        $scope.atoz = [];

        $scope.poiObjects = [];

        $scope.activeLetter = "";

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
        };

        $scope.criteriaMatch = function(criteria) {
            if (typeof criteria != "string" || criteria == "")
                return 0;
            //console.log("criteriaMatch.criteria:", criteria, typeof criteria);
            return function(item) {
                var name = item.names.translations[wayfinder.getLanguage()]
                    .toLowerCase().charAt(0);
                return name === criteria;
            }
        };

        $scope.setLetterActive = function(letter, letters) {
            if (letter.active) return 0;
            for (var i in letters) {
                if (letters[i].name == letter.name)
                    continue;
                else
                    letters[i].active = false;
            }
            letter.active = true;
            return 1;
        };

        $scope.getActiveLetter = function(letters) {
            var letter;
            for (var i in letters) {
                if (letters[i].active) {
                    letter = letters[i];
                    break;
                }
            }
            if (typeof letter == "undefined") return 0;
            //console.log("getActiveLetter.letter:", letter)
            return letter;
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.$watch(
            function() {
                return wayfinder.getLanguage();
            },
            function(newValue, oldValue) {
                $scope.activeLetter = "";
            });

        $timeout(function() {
            $scope.poiObjects = wayfinderService.getPOIs();
            $scope.atoz = wayfinderService.getAtozLetters();
            console.log("AtozController.data.loaded");
        }, 20);
    }
]);

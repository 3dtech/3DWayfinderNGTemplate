//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('TopicsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wayfinderService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, wayfinderService, wayfinder) {
        $scope.groups = [];
        $scope.activeGroup = "";

        $scope.collapsedGroup = [];
        $scope.collapsedFloor = [];
        $scope.activeLetter = "";

        $scope.toggleGroupActive = function(group) {
            group.active != group.active;
            return;
        };

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.expand = function(group) {
            group.show = !group.show;
        };

        $scope.$watch("collapsedGroup", function(newVal, oldVal) {
            //console.log("collapsedGroup:", oldVal, "->", newVal);
        });

        $timeout(function() {
            $scope.groups = wayfinderService.getGroups();
            console.log("TopicsController-wf.data.loaded");
        }, 20);
    }
]);

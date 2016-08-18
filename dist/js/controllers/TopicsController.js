//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('TopicsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'wayfinderService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, $routeParams, wayfinderService, wayfinder) {
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

        $scope.$on("wf.data.loaded", function() {
            $timeout(function() {
                $scope.groups = wayfinderService.getGroups();
                if ($routeParams) {
                    for (var key in $scope.groups) {
                        if ($scope.groups[key].id == $routeParams.id)
                            $scope.groups[key].active = true;
                        else
                            $scope.groups[key].active = false;
                    }
                }
                console.log("TopicsController-wf.data.loaded");
                $scope.$apply();
            }, 20);
        });

        $timeout(function() {
            $scope.groups = wayfinderService.getGroups();
            if ($routeParams) {
                for (var key in $scope.groups) {
                    if ($scope.groups[key].id == $routeParams.id)
                        $scope.groups[key].active = true;
                    else
                        $scope.groups[key].active = false;
                }
            }
            console.log("TopicsController-wf.data.loaded");
        }, 20);
    }
]);

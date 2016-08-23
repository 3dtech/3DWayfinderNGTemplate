//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wayfinderApp.controller('TopicsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'wfService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, $routeParams, wfService, wayfinder) {
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

        /*$scope.$on("wf.data.loaded", function() {
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
        });*/

        $rootScope.$emit("topics.init", $scope);

        $scope.$on('wfService.groups.loading', function(event) {
            console.debug("groups still loading, resend")
            $timeout(function() {
                $rootScope.$emit("topics.init", $scope);
            },100);
        });

        $scope.$on('wfService.groups.loaded', function(event) {
            console.debug("TOPICS: wfService.groups received!");
            $scope.apply();
        });
    }
]);

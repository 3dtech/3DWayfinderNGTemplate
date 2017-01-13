//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('TopicsController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'wfService',
    'wfangular',
    function($rootScope, $scope, $timeout, $routeParams, wfService,
        wayfinder) {
        console.debug("TC.loaded");
        var topics = $scope;
        $scope.groups = [];
        $scope.activeGroup = "";
        var wfTopicsDataLoaded = false;

        $scope.collapsedGroup = [];
        $scope.collapsedFloor = [];
        $scope.activeLetter = "";

        $scope.toggleGroupActive = function(group) {
            group.active = !group.active;
            return 0;
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

        $rootScope.$emit("topics.init", topics);

        $scope.$on('wf.topic.selected', function(event, group) {

            if ($routeParams) {
                for (var key in $scope.groups) {
                    $scope.groups[key].active = $scope.groups[key].id == $routeParams.id;
                }
            }
        });

        /*topics.$on( 'wfService.groups.loading', function ( event ) {
            console.debug( "TOPICS: wfService.loading " );
            $timeout( function () {
                $rootScope.$emit( "topics.init", topics );
            }, 100 );
        } );

        topics.$on( 'wfService.groups.loaded', function ( event,
            data ) {
            if ( !wfTopicsDataLoaded ) {
                $scope.$apply( function () {
                    wfTopicsDataLoaded = true;
                    console.debug(
                        "TOPICS: wfService.loaded" );
                    //topics.groups = wfService.getGroups();
                } );
            }
        } );*/
    }
]);

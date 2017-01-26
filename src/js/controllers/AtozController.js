/* global $, angular, wfApp, WayfinderAPI */
//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('AtozController', [
    '$rootScope',
    '$scope',
	'$routeParams',
    '$timeout',
    'wfService',
    'wfangular',
    function($rootScope, $scope,$routeParams, $timeout, wfService, wayfinder) {
        $scope.atoz = wfService.data.atoz;
        $scope.poiObjects = wfService.data.pois;
        $scope.activeLetter = "";
        var wfAtozDataLoaded = false;

        $scope.showPath = function(poi) {
            console.log("showPath.poi:", poi, wayfinder.getKiosk(),
                wayfinder.getKioskNode());
            $rootScope.$broadcast("wf.nav-menu", "hide");
            wayfinder.showKiosk();
            wayfinder.showPath(poi.getNode(), poi);
        };

		function checkRouteParams() {
			if (!$routeParams) return;
			$scope.$apply(function() {
				$scope.poiObjects = wfService.data.pois;
			});
			$rootScope.$broadcast("wf.nav-menu", "show");
		}

        $scope.criteriaMatch = function(criteria) {
            if (typeof criteria != "string" || criteria == "")
                return 0;
            //console.log("criteriaMatch.criteria:", criteria, typeof criteria);
            return function(item) {
                var name = item.getName(wayfinder.getLanguage())
                    .toLowerCase().charAt(0);
                return name === criteria;
            }
        };

        $scope.setLetterActive = function(letter, letters) {
            if (letter.active) return 0;
            angular.forEach(letters, function(item) {
                item.active = item.name == letter.name;
            });
            return 1;
        };

        $scope.getActiveLetter = function(letters) {
            var letter = null;
            angular.forEach(letters, function(item) {
                if (item.active) {
                    letter = item;
                }
            });
            if (typeof letter == null) return 0;
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

		$scope.$on("wf.map.ready", function(event) {

			checkRouteParams();
		});

		$timeout(function () {
			checkRouteParams();
		}, 10);

        /*$timeout( function () {
            $scope.poiObjects = wfService.getPOIs();
            $scope.atoz = wfService.getAtozLetters();
            console.log( "AtozController.data.loaded" );
        }, 20 ); */

        //$rootScope.$emit( "atoz.init" , $scope );

        /*$rootScope.$on( 'wfService.atoz.loading', function ( event ) {
            console.debug("ATOZ: wfService.loading");
            $timeout( function () {
                $rootScope.$emit( "atoz.init" , $scope);
            }, 100 );
        } );

        $rootScope.$on( 'wfService.atoz.loaded', function ( event, data ) {
            if ( !wfAtozDataLoaded )
                $scope.$apply( function () {
                    wfAtozDataLoaded = true;
                    console.debug(
                        "atoz received wf.service.pois",
                        event, data );
                    $scope.atoz = data.letters;
                    $scope.poiObjects = data.pois;
                    console.debug( "atoz:", $scope.atoz,
                        "pois:", $scope.poiObjects );
                } );
        } );*/
    }
]);

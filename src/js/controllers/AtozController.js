//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller( 'AtozController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wfService',
    'wfangular3d',
    function ( $rootScope, $scope, $timeout, wfService, wayfinder ) {
        $scope.atoz = null;
        $scope.poiObjects = null;
        $scope.activeLetter = "";
        var wfAtozDataLoaded = false;

        $scope.showPath = function ( poi ) {
            console.log( "showPath.poi:", poi, wayfinder.getKiosk(),
                wayfinder.getKioskNode() );
            wayfinder.showKiosk();
            wayfinder.showPath( poi.getNode(), poi );
        };

        $scope.criteriaMatch = function ( criteria ) {
            if ( typeof criteria != "string" || criteria == "" )
                return 0;
            //console.log("criteriaMatch.criteria:", criteria, typeof criteria);
            return function ( item ) {
                var name = item.names.translations[ wayfinder.getLanguage() ]
                    .toLowerCase().charAt( 0 );
                return name === criteria;
            }
        };

        $scope.setLetterActive = function ( letter, letters ) {
            if ( letter.active ) return 0;
            for ( var i in letters ) {
                if ( letters[ i ].name == letter.name )
                    continue;
                else
                    letters[ i ].active = false;
            }
            letter.active = true;
            return 1;
        };

        $scope.getActiveLetter = function ( letters ) {
            var letter;
            for ( var i in letters ) {
                if ( letters[ i ].active ) {
                    letter = letters[ i ];
                    break;
                }
            }
            if ( typeof letter == "undefined" ) return 0;
            //console.log("getActiveLetter.letter:", letter)
            return letter;
        };

        $scope.getLanguage = function () {
            return wayfinder.getLanguage();
        };

        $scope.$watch(
            function () {
                return wayfinder.getLanguage();
            },
            function ( newValue, oldValue ) {
                $scope.activeLetter = "";
            } );

        /*$timeout( function () {
            $scope.poiObjects = wfService.getPOIs();
            $scope.atoz = wfService.getAtozLetters();
            console.log( "AtozController.data.loaded" );
        }, 20 ); */

        $rootScope.$emit( "atoz.init" , $scope );

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
] );

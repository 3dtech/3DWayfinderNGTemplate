wfApp.factory( 'wfService', [ '$rootScope', '$timeout', 'wfangular3d', function (
    $rootScope, $timeout, wayfinder ) {
    var poiGroups = null;
    var poiObjects = null;
    var floorPOIs = null;
    var floors = null;
    var activeFloor = null;
    var shortcuts = null;
    var atozLetters = null;
    var atozLettersLoaded = null;
    var poiObjectsLoaded = null;
    var maxInactivityTime = null;

    var wfDataLoaded = false;

    var tabs = [ {
            name: 'search',
            icon: 'icon-search',
            link: '/search',
            active: false
        }, {
            name: 'topics',
            icon: 'icon-topics',
            link: '/topics',
            active: false
        }, {
            name: 'atoz',
            icon: 'icon-atoz',
            link: '/atoz',
            active: false
        }
        /*, {
                name: 'floors',
                //icon: 'icon-floors',
                icon: 'fa fa-list-ol',
                link: '/floors',
                active: false
            }*/
    ];

    function stringToBoolean( string ) {
        switch ( string.toLowerCase().trim() ) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return Boolean( string );
        }
    };

    function extractFloors( wfFloors ) {
        console.debug("extractFloors:", wfFloors);
        var arr = [];
        for ( var floor in wfFloors ) {
            wfFloors[ floor ].active = false;
            arr.push( wfFloors[ floor ] );
        }
        console.debug("extractFloors:", arr);

        return arr;
    };

    function extractShortcuts( wfShortcuts ) {
        var arr = [];
        for ( var shortcut in wfShortcuts ) {
            if ( stringToBoolean( wfShortcuts[ shortcut ].showInTopMenu ) ) {
                wfShortcuts[ shortcut ].backgroundImage = window.location.protocol +
                    WayfinderAPI.getURL("images", "get", wfShortcuts[ shortcut ].imageID);
                wfShortcuts[ shortcut ].capital = wfShortcuts[ shortcut ].names.translations[wayfinder.getLanguage()].charAt(0);
                arr.push( wfShortcuts[ shortcut ] );
            }
        };
        return arr;
    };

    function extractGroups( groups ) {
        var arr = [];
        for ( var key in groups ) {
            // add hasOwnPropertyCheck if needed
            var group = groups[ key ];
            if ( stringToBoolean( group.showInMenu ) ) {
                //console.debug("group:", group.getName(wayfinder.getLanguage()), "showInMenu:", stringToBoolean(group.showInMenu), group);
                //$scope.collapsedGroup.push(false);
                group.image = getGroupImage( group );
                group.colorHEX = getGroupColorHEX( group );
                group.colorRGBA = getGroupColorRGBA( group );
                group.active = false;
                arr.push( group );
            }
        }
        console.debug( "WF-SERVICE: extractGroups.arr:", arr,
            poiGroups );
        return arr;
    };

    function extractPOIs( pois ) {
        var arr = [];
        for ( var i in pois ) {
            var poi = pois[ i ];
            if ( poi.showInMenu == "1" ) {
                poi.backgroundImage = window.location.protocol +
                    WayfinderAPI.getURL( "images", "get", poi.background_id );
                arr.push( poi );
            }
        };
        if ( arr.length == 0 ) {
            console.debug(
                "WF-SERVICE: no pois found to be displayed" );
            return [];
        }
        //console.debug("wfService.extractPOIs:", pois, "->", arr);
        return arr;
    };

    function extractPOIsByFloor( floors ) {
        var arr = {};
        for ( var i in floors ) {
            //$scope.collapsedFloor.push(false);
            arr[ floors[ i ].index ] = [];
            for ( var j in floors[ i ].pois ) {
                if ( floors[ i ].pois[ j ].showInMenu == "1" )
                    arr[ floors[ i ].index ].push( floors[ i ].pois[
                        j ] );
            }
        }
        return arr;
    };

    function extractAtoZLetters( pois, language ) {
        var arr = [];
        var arr1 = [];
        for ( var i in pois ) {
            if ( pois[ i ].showInMenu ) {
                if ( arr.indexOf( pois[ i ].getName( language )
                        .toLowerCase().charAt( 0 ) ) == -1 ) {
                    //console.log("letter", pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0), "exists? :", (arr.indexOf(pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0)) == -1));
                    arr.push( pois[ i ].getName( language )
                        .toLowerCase().charAt( 0 ) );
                }
            }
        }
        for ( var key in arr ) arr1.push( {
            name: arr[ key ],
            active: false
        } );
        //console.log("getAtoZLetters.arr1:", arr1);
        return arr1;
    };

    function getGroupColorHEX( group ) {
        //Function to convert hex format to a rgb textColor
        if ( !group ) return;
        var rgb = group.getColor();
        var r = rgb[ "r" ];
        var g = rgb[ "g" ];
        var b = rgb[ "b" ];
        var a = rgb[ "a" ];
        var textColor = "#" + r.toString( 16 ).slice( -2 ) + g.toString(
            16 ).slice( -2 ) + b.toString( 16 ).slice( -2 );
        return textColor;
    };

    function getGroupColorRGBA( group ) {
        //Function to convert hex format to a rgb textColor
        if ( !group ) return;
        var rgb = group.getColor();
        var r = rgb[ "r" ];
        var g = rgb[ "g" ];
        var b = rgb[ "b" ];
        var a = rgb[ "a" ];
        var textColor = "rgba(" + parseInt( r.toString( 10 ) * 255 ) +
            "," + parseInt( g.toString( 10 ) * 255 ) + "," +
            parseInt( b.toString( 10 ) * 255 ) + "," + parseInt( a.toString(
                10 ) * 255 ) + ")";
        return textColor;
    };

    function getGroupImage( group ) {
        if ( !group ) return false;
        if ( group.imageID )
            return WayfinderAPI.getURL( "images", "get", [ group.imageID ] );
    };

    function getActiveTab() {
        for ( var tab in tabs ) {
            if ( tabs[ tab ].active ) {
                return tabs[ tab ];
            }
        }
        return false;
    };

    function setActiveTab( tab ) {
        for ( var key in tabs ) {
            if ( tabs[ key ].name == ( tab.name || tab ) ) {
                tabs[ key ].active = true;
            } else {
                tabs[ key ].active = false;
            }
        }
    };

    /**** TESTING on demand loading ****/

    $rootScope.$on( 'atoz.init', function ( event, atoz ) {
        console.debug( "atoz.init received" );
        if ( poiObjects != null && atozLetters != null ) {
            atoz.poiObjects = poiObjects;
            atoz.atoz = atozLetters;
            $rootScope.$broadcast( "wfService.atoz.loaded" )
        } else {
            $rootScope.$broadcast( "wfService.atoz.loading" );
        }
    } );

    $rootScope.$on( 'topics.init', function ( event, topics ) {
        console.debug( "WF-SERVICE: topics.init received" );
        if ( poiGroups != null ) {
            console.debug( "WF-SERVICE: loaded" );
            topics.groups = poiGroups;
            $rootScope.$broadcast(
                "wfService.groups.loaded" );
        } else {
            console.debug( "WF-SERVICE: still loading" );
            $rootScope.$broadcast(
                'wfService.groups.loading' );
        }
    } );

    /**** TESTING on demand loading ****/

    /*** SCOPE WATCHERS ***/
    $rootScope.$on( 'wf.floor.change', function ( event, floor ) {
        console.debug( "floor.change:", floor, floors );
        activeFloor = floor;
        angular.forEach( floors, function ( value, key ) {
            if ( value.index == floor.index )
                value.active = true;
            else
                value.active = false;
        } );
    } );
    $rootScope.$on( 'wf.language.change', function ( key ) {} );

    $rootScope.$on( 'app.screensaving', function ( event,
        screensaving ) {
        $rootScope.screensaving = screensaving;
    } )

    $rootScope.$on( 'wf.zoom.change', function ( event, zoom ) {
        $rootScope.trigger();
    } );

    $rootScope.$on( 'wf.toggle-nav-menu', function ( event ) {
        $rootScope.toggleNavMenu();
    } );

    $rootScope.$on( "wf.poi.click", function ( event, poi ) {} );

    $rootScope.$on( 'app.screensaving', function ( event,
        screensaving ) {
        if ( screensaving ) {}
    } );

    $rootScope.$on( 'wf.data.loaded', function ( event, asi ) {
        //console.log( "WayfinderCtrl-wf.data.loaded" );
        if ( !wfDataLoaded ) {
            wfDataLoaded = true;
            $rootScope.$apply(
                function () {
                    if ( floors == null )
                        floors = extractFloors(
                            wayfinder.building.getFloors()
                        );
                    if ( shortcuts == null )
                        shortcuts = extractShortcuts(
                            wayfinder.getPOIGroups() );
                    if ( poiGroups == null )
                        poiGroups = extractGroups(
                            wayfinder.getPOIGroups() );
                    if ( poiObjects == null )
                        poiObjects = extractPOIs(
                            wayfinder.getPOIsArray() );
                    if ( floorPOIs == null )
                        floorPOIs = extractPOIsByFloor(
                            wayfinder.building.floors );
                    if ( atozLetters == null )
                        atozLetters =
                        extractAtoZLetters(
                            wayfinder.getPOIs(),
                            wayfinder.getLanguage() );
                } );
            if ( wayfinder.settings.data[
                    "kiosk.max-inactivity" ] ) {
                maxInactivityTime = parseInt( wayfinder.settings
                        .data[ "kiosk.max-inactivity" ], 10
                    ) *
                    1000;
            };
        };
        //console.log( "tabs:", tabs );
    } );

    return {
        getTabs: function () {
            return tabs;
        },
        getGroups: function () {
            return poiGroups;
        },
        /*setGroups: function ( groups ) {
            console.log( "wfService.setGroups" );
            poiGroups = extractGroups( groups );
        },*/
        getPOIs: function () {
            return poiObjects;
        },
        /*setPOIs: function ( pois ) {
            console.log( "wfService.setPOIs" );
            poiObjects = extractPOIs( pois );
        },*/
        getFloors: function () {
            return floors;
        },
        getShortcuts: function () {
            return shortcuts;
        },
        getFloorsPOIs: function () {
            return floorPOIs;
        },
        /*setFloorsPOIs: function ( floors ) {
            console.log( "wfService.setFloorsPOIs" );
            floorPOIs = extractPOIsByFloor( floors );
        },*/
        getAtozLetters: function () {
            return atozLetters;
        },
        /*setAtozLetters: function ( pois, language ) {
            console.log( "wfService.setAtozLetters" );
            atozLetters = extractAtoZLetters( pois,
                language );
        },*/
        getActiveTab: function () {
            return getActiveTab();
        },
        setActiveTab: function ( tab ) {
            //console.log( "wfService.setActiveTab", tab );
            setActiveTab( tab );
        },
        getSessionTimeout: function () {
            return maxInactivityTime;
        },
        getActiveFloor: function () {
            return activeFloor;
        }
    };
} ] );

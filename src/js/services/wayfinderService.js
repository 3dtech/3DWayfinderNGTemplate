wfApp.factory( 'wfService', [ '$rootScope', '$timeout', 'wfangular3d', function (
    $rootScope, $timeout, wayfinder ) {
    var poiGroups = null;
    var poiObjects = null;
    var floorPOIs = null;
    var floors = null;
    var activeFloor = null;
    var shortcuts = null;
    var atozLetters = null;
    var maxInactivityTime = null;

    var wfDataLoaded = false;

    var tabs = [ {
            name: 'search',
            icon: 'icon-iglu-search',
            link: '/search',
            active: false
        }, {
            name: 'topics',
            icon: 'icon-iglu-list-nested    ',
            link: '/topics',
            active: false
        }, {
            name: 'atoz',
            icon: 'icon-iglu-atoz',
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
        if ( angular.isString( string ) ) {
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
        } else {
            switch ( string ) {
                case 1:
                    return true;
                case 2:
                    return false;
                default:
                    return false;
            }
        }
    }

    function extractFloors( data ) {
        var arr = [];
        angular.forEach(data, function(element) {
            arr.push(element);
        });
        console.debug("extractFloors:", arr);
        return arr;
    }

    function extractShortcuts( data ) {
        var arr = [];
        angular.forEach(data, function( element ) {
            if ( stringToBoolean( element.showInTopMenu ) ) {
                element.backgroundImage = window.location.protocol +
                    WayfinderAPI.getURL("images", "get", element.imageID);
                element.capital = element.names.translations[wayfinder.getLanguage()].charAt(0);
                arr.push( element );
            }
        });
        return arr;
    }

    function extractGroups( data ) {
        var arr = [];
        angular.forEach( data, function( element ) {
            // add hasOwnPropertyCheck if needed
            if ( stringToBoolean( element.showInMenu ) ) {
                element.image = getGroupImage( element );
                element.colorHEX = getGroupColorHEX( element );
                element.colorRGBA = getGroupColorRGBA( element );
                element.active = false;
                arr.push( element );
            }
        });
        console.debug( "WF-SERVICE: extractGroups.arr:", arr,
            poiGroups );
        return arr;
    }

    function extractPOIs( data ) {
        var arr = [];
        angular.forEach( data, function(element){
            if ( element.showInMenu == "1" ) {
                element.backgroundImage = window.location.protocol +
                    WayfinderAPI.getURL( "images", "get", element.background_id );
                arr.push( element );
            }
        });
        if ( arr.length == 0 ) {
            console.debug(
                "WF-SERVICE: no pois found to be displayed" );
            return [];
        }
        //console.debug("wfService.extractPOIs:", pois, "->", arr);
        return arr;
    }

    function extractPOIsByFloor( data ) {
        var arr = [];
        angular.forEach( data, function (element) {
            arr[ element.index ] = [];
            var pois = element.pois;
            angular.forEach( pois, function (item) {
                if ( stringToBoolean(item.showInMenu) )
                    arr[ element.index ].push( item );
            })
        });
        return arr;
    }

    function extractAtoZLetters( pois, language ) {
        var arr = [];
        var arr1 = [];
        angular.forEach( pois, function (element) {
            if ( element.showInMenu ) {
                if ( arr.indexOf( element.getName( language )
                        .toLowerCase().charAt( 0 ) ) == -1 ) {
                    arr.push( element.getName( language )
                        .toLowerCase().charAt( 0 ) );
                }
            }
        });
        angular.forEach( arr, function (item) {
            arr1.push(
                {
                    "name": item,
                    "active": false
                }
            );
        });
        return arr1;
    }

    function getGroupColorHEX( group ) {
        //Function to convert hex format to a rgb textColor
        if ( !group ) return;
        var rgb = group.getColor();
        var r = rgb[ "r" ];
        var g = rgb[ "g" ];
        var b = rgb[ "b" ];
        var a = rgb[ "a" ];
        return "#" + r.toString(16).slice(-2) + g.toString(
                16).slice(-2) + b.toString(16).slice(-2);
    }

    function getGroupColorRGBA( group ) {
        //Function to convert hex format to a rgb textColor
        if ( !group ) return;
        var rgb = group.getColor();
        var r = rgb[ "r" ];
        var g = rgb[ "g" ];
        var b = rgb[ "b" ];
        var a = rgb[ "a" ];
        return "rgba(" + parseInt(r.toString(10) * 255) +
            "," + parseInt(g.toString(10) * 255) + "," +
            parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(
                    10) * 255) + ")";
    }

    function getGroupImage( group ) {
        if ( !group ) return false;
        if ( group.imageID )
            return WayfinderAPI.getURL( "images", "get", [ group.imageID ] );
    }

    function getActiveTab() {
        for ( var tab in tabs ) {
            if ( tabs[ tab ].active ) {
                return tabs[ tab ];
            }
        }
        return false;
    }

    function setActiveTab( tab ) {
        angular.forEach( tabs, function(element) {
            element.active = element.name == ( tab.name || tab );
        })
    }

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
        angular.forEach( floors, function ( value ) {
            value.active = value.index == floor.index;
        } );
    } );
    $rootScope.$on( 'wf.language.change', function ( key ) {} );

    $rootScope.$on( 'app.screensaving', function ( event,
        screensaving ) {
        $rootScope.screensaving = screensaving;
    } );

    $rootScope.$on( 'wf.zoom.change', function () {
        $rootScope.trigger();
    } );

    $rootScope.$on( 'wf.toggle-nav-menu', function (  ) {
        $rootScope.toggleNavMenu();
    } );

    $rootScope.$on( "wf.poi.click", function ( event, poi ) {} );

    $rootScope.$on( 'app.screensaving', function ( event,
        screensaving ) {
        if ( screensaving ) {}
    } );

    $rootScope.$on( 'wf.data.loaded', function (  ) {
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
                    ) * 1000;
            }
        }
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

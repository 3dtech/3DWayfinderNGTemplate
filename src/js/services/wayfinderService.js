wayfinderApp.factory('wfService', ['$rootScope', '$timeout', 'wfangular3d', function($scope, $timeout, wayfinder) {
    $scope.groups = null;
    $scope.poiObjects = null;
    $scope.floorsPOIs = null;
    $scope.atozLetters = null;
    $scope.atozLettersLoaded = null;
    $scope.poiObjectsLoaded = null;

    $scope.tabs = [{
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

    function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
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
                return Boolean(string);
        }
    }

    function extractGroups(groups) {
        var arr = [];
        for (var key in groups) {
            // add hasOwnPropertyCheck if needed
            var group = groups[key];
            if (stringToBoolean(group.showInMenu)) {
                //console.debug("group:", group.getName(wayfinder.getLanguage()), "showInMenu:", stringToBoolean(group.showInMenu), group);
                //$scope.collapsedGroup.push(false);
                group.image = getGroupImage(group);
                group.colorHEX = getGroupColorHEX(group);
                group.colorRGBA = getGroupColorRGBA(group);
                group.active = false;
                arr.push(group);
            }
        }
        console.debug("extractGroups.arr:", arr, $scope.groups);
        return arr;
    };

    function extractPOIs(pois) {
        var arr = [];
        for (var i in pois) {
            var poi = pois[i];
            if (poi.showInMenu == "1") {
                poi.backgroundImage = window.location.protocol + WayfinderAPI.getURL("images", "get", poi.background_id);
                arr.push(poi);
            }
        };
        if (arr.length == 0) {
            console.debug("no pois found to be displayed");
            return [];
        }
        //console.debug("wfService.extractPOIs:", pois, "->", arr);
        return arr;
    };

    function extractPOIsByFloor(floors) {
        var arr = {};
        for (var i in floors) {
            //$scope.collapsedFloor.push(false);
            arr[floors[i].index] = [];
            for (var j in floors[i].pois) {
                if (floors[i].pois[j].showInMenu == "1")
                    arr[floors[i].index].push(floors[i].pois[j]);
            }
        }
        return arr;
    };

    function extractAtoZLetters(pois, language) {
        var arr = [];
        var arr1 = [];
        for (var i in pois) {
            if (pois[i].showInMenu) {
                if (arr.indexOf(pois[i].getName(language)
                        .toLowerCase().charAt(0)) == -1) {
                    //console.log("letter", pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0), "exists? :", (arr.indexOf(pois[i].getName(wayfinder.getLanguage()).toLowerCase().charAt(0)) == -1));
                    arr.push(pois[i].getName(language)
                        .toLowerCase().charAt(0));
                }
            }
        }
        for (var key in arr) arr1.push({
            name: arr[key],
            active: false
        });
        //console.log("getAtoZLetters.arr1:", arr1);
        return arr1;
    };

    function getGroupColorHEX(group) {
        //Function to convert hex format to a rgb textColor
        if (!group) return;
        var rgb = group.getColor();
        var r = rgb["r"];
        var g = rgb["g"];
        var b = rgb["b"];
        var a = rgb["a"];
        var textColor = "#" + r.toString(16).slice(-2) + g.toString(
            16).slice(-2) + b.toString(16).slice(-2);
        return textColor;
    };

    function getGroupColorRGBA(group) {
        //Function to convert hex format to a rgb textColor
        if (!group) return;
        var rgb = group.getColor();
        var r = rgb["r"];
        var g = rgb["g"];
        var b = rgb["b"];
        var a = rgb["a"];
        var textColor = "rgba(" + parseInt(r.toString(10) * 255) +
            "," + parseInt(g.toString(10) * 255) + "," +
            parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(
                10) * 255) + ")";
        return textColor;
    };

    function getGroupImage(group) {
        if (!group) return false;
        if (group.imageID)
            return WayfinderAPI.getURL("images", "get", [group.imageID]);
    };

    function getActiveTab() {
        for (var tab in $scope.tabs) {
            if ($scope.tabs[tab].active) {
                return $scope.tabs[tab];
            }
        }
        return false;
    };

    function setActiveTab(tab) {
        for (var key in $scope.tabs) {
            if ($scope.tabs[key].name == (tab.name || tab)) {
                $scope.tabs[key].active = true;
            }
            else {
                $scope.tabs[key].active = false;
            }
        }
    };

    /**** TESTING on demand loading ****/

    $scope.$on('atoz.init', function(e) {
        console.debug("atoz.init received");
        $scope.$emit("wf.service.pois", {
            "pois": $scope.poiObjects,
            "letters": $scope.atozLetters
        });
    });

    $scope.$watch('atozLetters', function(newVal, oldVal) {
        if (newVal != null) {
            $scope.$emit('wf.atozLetters.loaded', newVal);
            $scope.atozLettersLoaded = true;
        }
    });

    $scope.$on('topics.init', function(event, scope) {
        console.debug("WF-SERVICE: topics.init received", $scope, scope);
        if ($scope.groups == null) {
            console.debug("WF-SERVICE: groups still loading");
            scope.$emit("wfService.groups.loading");
        }
        else {
            console.debug("WF-SERVICE: groups loaded!");
            scope.$emit("wfService.groups.loaded");
            scope.groups = $scope.groups;
        }
    });

    /**** TESTING on demand loading ****/

    /*** SCOPE WATCHERS ***/
    $scope.$on('wf.language.change', function(key) {});

    $scope.$on('app.screensaving', function(event, screensaving) {
        $scope.screensaving = screensaving;
    })

    $scope.$on('wf.zoom.change', function(event, zoom) {
        $scope.trigger();
    });

    $scope.$on('wf.toggle-nav-menu', function(event) {
        $scope.toggleNavMenu();
    });

    $scope.$on("wf.poi.click", function(event, poi) {});

    $scope.$on('app.screensaving', function(event, screensaving) {
        if (screensaving) {}
    });

    $scope.$on('wf.data.loaded', function(event, asi) {
        console.log("WayfinderCtrl-wf.data.loaded");
        $timeout(
            function() {
                if ($scope.groups == null)
                    $scope.groups = extractGroups(wayfinder.getPOIGroups());
                if ($scope.poiObjects == null)
                    $scope.poiObjects = extractPOIs(wayfinder.getPOIsArray());
                if ($scope.floorsPOIs == null)
                    $scope.floorsPOIs = extractPOIsByFloor(
                        wayfinder.building
                        .floors);
                if ($scope.atozLetters == null)
                    $scope.atozLetters = extractAtoZLetters(
                        wayfinder.getPOIs(),
                        wayfinder.getLanguage());
            }, 10);
        if (wayfinder.settings.data["kiosk.max-inactivity"]) {
            maxInactivityTime = parseInt(wayfinder.settings
                    .data["kiosk.max-inactivity"], 10) *
                1000;
            wayfinder.setKiosk("394");
        };
        console.log("tabs:", $scope.tabs);
    });

    return {
        getTabs: function() {
            return $scope.tabs;
        },
        getGroups: function() {
            return $scope.groups;
        },
        setGroups: function(groups) {
            console.log("wfService.setGroups");
            $scope.groups = extractGroups(groups);
        },
        getPOIs: function() {
            return $scope.poiObjects;
        },
        setPOIs: function(pois) {
            console.log("wfService.setPOIs");
            $scope.poiObjects = extractPOIs(pois);
        },
        getFloorsPOIs: function() {
            return $scope.floorsPOIs;
        },
        setFloorsPOIs: function(floors) {
            console.log("wfService.setFloorsPOIs");
            $scope.floorsPOIs = extractPOIsByFloor(floors);
        },
        getAtozLetters: function() {
            return $scope.atozLetters;
        },
        setAtozLetters: function(pois, language) {
            console.log("wfService.setAtozLetters");
            $scope.atozLetters = extractAtoZLetters(pois, language);
        },
        getActiveTab: function() {
            return getActiveTab();
        },
        setActiveTab: function(tab) {
            console.log("wfService.setActiveTab", tab);
            setActiveTab(tab);
        }
    };
}]);

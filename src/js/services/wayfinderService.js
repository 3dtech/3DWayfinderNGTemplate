/* global $, angular, wfApp, WayfinderAPI */

wfApp.factory('wfService', [
	'$rootScope',
	'$timeout',
	'$q',
	'wfangular',
	'$state',
	function($rootScope, $timeout, $q, wayfinder,$state) {
		return new(function getData() {

			var self = this;
			var wfDataLoaded = false;
			var displayNavMenu = false;

			var tabs = [{
					name: 'search',
					icon: 'icon-iglu-search',
					link: '/search/',
					active: false,
					gui: 'search'
				}, {
					name: 'topics',
					icon: 'icon-iglu-list-nested    ',
					link: '/topics/',
					active: false,
					gui: 'topics'
				}, {
					name: 'atoz',
					icon: 'icon-iglu-atoz',
					link: '/atoz/',
					active: false,
					gui: 'az'
				}
				/*, {
				 name: 'floors',
				 //icon: 'icon-floors',
				 icon: 'fa fa-list-ol',
				 link: '/floors',
				 active: false
				 }*/
			];

			this.data = {
				groups: null,
				pois: null,
				floorPOIs: null,
				floors: null,
				activeFloor: null,
				shortcuts: null,
				atoz: null,
				timeout: null,
				tabs: tabs
			};



			function boolify(val) {
				// console.log(val + ':' + typeof val);
				switch (typeof val) {
					case "undefined":
					case "object":
					case "array":
						return false;
					case "boolean":
						return val;
					case "string":
						if (val.toLowerCase().match(/1|true|yes/g)) return true;
						else if (val.toLowerCase().match(/0|false|no/g)) return false;
						else return false;
					case "number":
						if ((Math.round(val) || val) > 0) return true;
						else return false;
					case "default":
						break;
				}
			};

			function stringToBoolean(string) {
				if (angular.isString(string)) {
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
				else {
					switch (string) {
						case 1:
							return true;
						case 2:
							return false;
						default:
							return false;
					}
				}
			}

			function extractFloors(data) {
				var arr = [];
				angular.forEach(data, function(element) {
					if (!!element.showInMenu) {
						arr.push(element);
					}
				});
				return arr;
			}

			function extractShortcuts(data) {
				var arr = [];
				angular.forEach(data, function(element) {
					if (stringToBoolean(element.showInTopMenu)) {
						element.backgroundImage = window.location.protocol +
							WayfinderAPI.getURL("images", "get", element.imageID);
						element.capital = element.names.translations[wayfinder.getLanguage()].charAt(0);
						arr.push(element);
					}
				});
				return arr;
			}

			function extractGroups(data) {
				var arr = [];
				angular.forEach(data, function(element) {
					// add hasOwnPropertyCheck if needed
					if (stringToBoolean(element.showInMenu) && Object.keys(element.pois).length) {
						element.image = getGroupImage(element);
						element.colorHEX = getGroupColorHEX(element);
						element.colorRGBA = getGroupColorRGBA(element);
						element.active = false;
						arr.push(element);
					}
				});
				// console.debug("extractGroups:", arr);
				return arr;
			}

			function extractPOIs(data) {
				var arr = [];
				angular.forEach(data, function(element) {
					if (!!element.showInMenu && !!element.getName(wayfinder.getLanguage())) {
						if (element.background_id != 0) {
							element.backgroundImage = window.location.protocol +
								WayfinderAPI.getURL("images", "get", element.background_id);
						}
						else {
							element.backgroundImage = false;
						}
						if (element.image_id != 0) {
							element.logoImage = window.location.protocol +
								WayfinderAPI.getURL("images", "get", element.image_id);
						}
						else {
							element.logoImage = false;
						}

						arr.push(element);
					}
				});
				if (arr.length == 0) {
					return [];
				}
				return arr;
			}

			function extractPOIsByFloor(data) {
				var arr = [];
				angular.forEach(data, function(element) {
					arr[element.index] = [];
					var pois = element.pois;
					angular.forEach(pois, function(item) {
						if (stringToBoolean(item.showInMenu)) {
							arr[element.index].push(item);
						}
					});
				});
				// console.debug("extractPOIsByFloor:", arr);
				return arr;
			}

			function extractAtoZLetters(pois, language) {
				var arr = [];
				var arr1 = [];
				angular.forEach(pois, function(element) {
					if (element.showInMenu && element.getNames(language).length) {
						if (arr.indexOf(element.getName(language)
								.toLowerCase().charAt(0)) == -1) {
							arr.push(element.getName(language)
								.toLowerCase().charAt(0));
						}
					}
				});
				angular.forEach(arr, function(item) {
					arr1.push({
						"name": item,
						"active": false
					});
				});
				// console.debug("extractAtoZLetters:", arr);
				return arr1;
			}

			function getGroupColorHEX(group) {
				//Function to convert hex format to a rgb textColor
				if (!group) return;
				var rgb = group.getColor();
				var r = rgb.r;
				var g = rgb.g;
				var b = rgb.b;
				var a = rgb.a;
				return "#" + r.toString(16).slice(-2) + g.toString(
					16).slice(-2) + b.toString(16).slice(-2);
			}

			function getGroupColorRGBA(group) {
				//Function to convert hex format to a rgb textColor
				if (!group) return;
				var rgb = group.getColor();
				var r = rgb.r;
				var g = rgb.g;
				var b = rgb.b;
				var a = rgb.a;
				return "rgba(" + parseInt(r.toString(10) * 255) +
					"," + parseInt(g.toString(10) * 255) + "," +
					parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(
						10) * 255) + ")";
			}

			function getGroupImage(group) {
				if (!group) return false;
				if (group.imageID) {
					return WayfinderAPI.getURL("images", "get", [group.imageID]);
				}
			}

			function getActiveTab() {
				for (var tab in tabs) {
					if (tabs[tab].active) {
						return tabs[tab];
					}
				}
				return false;
			}

			function getSessionTimeout() {
				console.log("wfservice.getsessiontoimeout:", wayfinder.settings
					.data["kiosk.max-inactivity"]);
				return $q.when(self.data.timeout);
			}

			function setActiveTab(tab) {
				angular.forEach(tabs, function(element) {
					element.active = element.name == (tab.name || tab);
				});
			}

			/*** SCOPE WATCHERS ***/
			$rootScope.$on('wf.floor.change', function(event, floor) {
				//console.debug( "floor.change:", floor, floors );
				self.data.activeFloor = floor;
				angular.forEach(self.data.floors, function(value) {
					value.active = value.index == floor.index;
				});
			});

			$rootScope.$on('app.screensaving', function(event, screensaving) {
				$rootScope.screensaving = screensaving;
			});

			$rootScope.$on('wf.zoom.change', function() {
				$rootScope.trigger();
			});

			$rootScope.$on('wf.nav-menu', function(event, data) {
				console.debug("wf.nav-menu:", data);
				switch (data) {
					case "show":
						displayNavMenu = true;
						break;
					case "hide":
						displayNavMenu = false;
						break;
					case "toggle":
						displayNavMenu = !displayNavMenu;
						break;
					case "default":
						displayNavMenu = !displayNavMenu;
						break;
				}
				console.debug("wfService.displayNavMenu:", displayNavMenu);
			});

			$rootScope.$on("wf.poi.click", function(event, poi) {
				console.debug("poi.clicked:", poi);
			});


			$rootScope.$on('wf.data.loaded', function() {
				if (!wfDataLoaded) {
					wfDataLoaded = true;
					if (!(!!self.data.floors)) {
						self.data.floors = extractFloors(
							wayfinder.building.getFloors()
						);
					}
					if (!(!!self.data.shortcuts)) {
						self.data.shortcuts = extractShortcuts(
							wayfinder.getPOIGroups());
					}
					if (!(!!self.data.poiGroups)) {
						self.data.groups = extractGroups(
							wayfinder.getPOIGroups());
					}
					if (!(!!self.data.poiObjects)) {
						self.data.pois = extractPOIs(
							wayfinder.getPOIsArray());
					}
					if (!(!!self.data.floorPOIs)) {
						self.data.floorPOIs = extractPOIsByFloor(
							wayfinder.building.floors);
					}
					if (!(!!self.data.atoz)) {
						self.data.atoz =
							extractAtoZLetters(
								wayfinder.getPOIs(),
								wayfinder.getLanguage());
						angular.forEach(wayfinder.getLanguages(), function(language) {
							// console.debug("wayfinderLanguages:", language);
						});
					}
					if (wayfinder.settings.data[
							"kiosk.max-inactivity"]) {
						self.data.timeout = parseInt(wayfinder.settings
							.data["kiosk.max-inactivity"], 10
						) * 1000;
					}
					if (!!self.data.atoz && !!self.data.floorPOIs && !!self.data.floors && !!self.data.groups && !!self.data.pois && !!self.data.shortcuts && !!self.data.tabs && !!self.data.timeout) {
						$rootScope.$broadcast("wfService.data.loaded");
					}
				}
			});

			$rootScope.$on('wf.map.ready', function(event) {
				console.debug("map-ready!");
			});

			/* SERVICE SETTERS AND GETTERS */
			this.boolify = function(value) {
				return boolify(value);
			};
			this.getTabs = function() {
				return self.data.tabs;
			};
			this.getGroups = function() {
				return self.data.poiGroups;
			};
			this.getPOIs = function() {
				return self.data.pois;
			};
			this.getFloors = function() {
				return self.data.floors;
			};
			this.getShortcuts = function() {
				return self.data.shortcuts;
			};
			this.getFloorsPOIs = function() {
				return self.data.floorPOIs;
			};
			this.getAtozLetters = function() {
				return self.data.atoz;
			};
			this.getActiveTab = function() {
				return getActiveTab();
			};
			this.setActiveTab = function(tab) {
				//console.log( "wfService.setActiveTab", tab );
				setActiveTab(tab);
			};
			this.getSessionTimeout = function() {
				return getSessionTimeout();
			};
			this.getActiveFloor = function() {
				return self.data.activeFloor;
			};
			this.isNavMenuVisible = function() {
				return displayNavMenu;
			};
		});
	}
]);

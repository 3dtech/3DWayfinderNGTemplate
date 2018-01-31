/* global $, angular, wfApp, WayfinderAPI */

// -------------------------------------------
// --------------- Controllers ---------------
// -------------------------------------------

wfApp.controller('MainController', [
	'wfService',
	'keyboardService',
	'wfangular',
	'$scope',
	'$timeout',
	'$rootScope',
	'cfpLoadingBar',
	'$state',
	function MainController(wfService,
							keyboardService,
							wayfinder,
							$scope,
							$timeout,
							$rootScope,
							cfpLoadingBar,
							$state) {
		$scope = $rootScope;
		$scope.buildingLogo = false;
		$scope.buildingTitle = false;
		$scope.wayfinder = wayfinder;
		$scope.animationsEnabled = true;
		$scope.bold = ['\<b\>', '\<\/b\>'];
		$scope.advertisements = wayfinder.advertisements;
		$scope.maxInactivityTime = 30;

		$scope.$watch('maxInactivityTime', function (newval, oldval) {
			console.log("maxInactivityTime:", oldval, "->", newval);
		});

		cfpLoadingBar.start();

		var lastTouch = -1;
		lastTouch = (new Date()).getTime();

		wfService.getSessionTimeout().then(function (result) {

			if (result) {
				console.log("timeout", result);
				$scope.maxInactivityTime = result.data;
			} else {
				console.log("Didn't get session timeout - missing or not available!");
			}
		});

		$scope.loadDefaultView = function () {
			if (window.innerWidth >= 1024 || window.innerWidth < window.innerHeight) {

				if (window.innerWidth >= 1024) {
					$scope.setActiveTab('atoz');
					$rootScope.$broadcast("wf.nav-menu", "show");
				}

				// // TODO: replace $location
				// if ($location.path() === '/' && $scope.isNavMenuVisible()) {
				// 	//console.log($location.path());
				// 	$location.path('/topics');
				// 	$scope.setActiveTab('topics');
				// }
				// else {

				// 	$location.path('/');
				// 	$rootScope.$broadcast("wf.nav-menu", "hide");
				// }
			}
		};

		$scope.go = function (path) {
			//  console.debug("path:", path);
			$state.go(path);
		};

		$scope.showTopic = function (group) {
			var tabs = Object.keys(wfService.getTabs());
			for (var i = 0; i < tabs.length; i++) {
				if (wfService.getTabs()[i].name == "topics") {
					wfService.setActiveTab(wfService.getTabs()[i]);
					break;
				}
			}
			$state.go('topics', {id: group.id});
			$timeout(function () {
				$scope.$broadcast("wf.topic.selected", group);
			}, 100);
		};

		$scope.showInfo = function (poi) {
			$state.go('info', {id: poi.id});
			$scope.setActiveTab('info');
			$scope.$broadcast("wf.nav-menu", "show");
		};

		$scope.toggleNavMenu = function () {
			if ($state.current.name === "" && window.innerWidth <= 1024) {
				$scope.setActiveTab('atoz');
				$state.go('atoz');

			}
			$scope.$broadcast("wf.nav-menu", "toggle");
		};

		$scope.isNavMenuVisible = function () {

			return wfService.isNavMenuVisible();
		};

		$scope.$on('wf.poi.click', function (event, poi) {
			$scope.showInfo(poi);
		});

		$scope.showPath = function (poi) {

			wayfinder.showPath(poi.getNode(), poi);
			console.log('width', screen.width);
			if (window.innerWidth < 1024) {
				$state.path('/');
				$rootScope.$broadcast("wf.nav-menu", "hide");
			}
		};

		$scope.getColorRGBA = function (group) {
			//Function to convert hex format to a rgb textColor
			if (!group) return;
			var rgb = group.getColor();
			var r = rgb.r;
			var g = rgb.g;
			var b = rgb.b;
			var a = rgb.a;
			return "rgba(" + parseInt(r.toString(10) * 255) + "," + parseInt(g.toString(10) * 255) + "," + parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(10) * 255) + ")";
		};

		/*** SCREENSAVER CONTROLS ***/

		function hideScreensaver() {
			$rootScope.$broadcast("app.screensaving", false);
			// here reset all the local variables, like menu items and stuff?jah
		}

		function showScreensaver() {
			$rootScope.$broadcast("app.screensaving", true);
			// show modal, mõttekam oleks vist mitte modal'it kasutada, sest sisu on pidevalt sama
		}

		/*** ACTIVITY CHECKER ***/

		function checker() {
			//console.log("Checker! time since lastTouch", (((new Date())
			//    .getTime() - lastTouch) / 1000), "sec");
			var time = (new Date()).getTime();
			if (time - lastTouch > $scope.maxInactivityTime) {
				if (lastTouch > -1) {
					onTimeout();
				}
				else {
					$timeout(checker, $scope.maxInactivityTime);
				}
			}
			else {
				$timeout(checker, $scope.maxInactivityTime - (time - lastTouch));
			}
		}

		function onTimeout() {
			//console.log("onTimeout");
			lastTouch = -1; //Disables timeouting until somebody has touched
			wayfinder.statistics.onSessionEnd();
			//wayfinder.restoreDefaultState();
			showScreensaver(); //näitame seda modalit
			//console.log(lastTouch);
		}

		$scope.trigger = function () {
			//console.log("Trigger! time since lastTouch", (((new Date())
			//  .getTime() - lastTouch) / 1000), "sec");
			//reset
			// console.debug("triggered!");
			if (lastTouch == -1) {
				//first click in a while
				hideScreensaver();
				wayfinder.statistics.onSessionStart();
				$timeout(checker, $scope.maxInactivityTime);
			}
			lastTouch = (new Date()).getTime();
		};

		$timeout(checker, $scope.maxInactivityTime);

		/*** SCOPE FUNCTIONS ***/

		$scope.showYAH = function () {
			wayfinder.showKiosk();
			if (window.innerWidth < 1024) {
				$rootScope.$broadcast("wf.nav-menu", "hide");
			}
		};

		$scope.cbResizeCtrl = function () {
			wayfinder.resize();
		};

		$scope.getGUITranslation = function (key, params) {
			if (params) return wayfinder.translator.get(key);
			return wayfinder.translator.get(key, params);
		};
		$scope.setActiveTab = function (tab) {
			//console.debug("MC: setActvieTab:", tab);
			wfService.setActiveTab(tab);
		};

		$scope.getActiveTab = function () {
			return wfService.getActiveTab();
		};

		$scope.tabs = wfService.getTabs();


		$scope.showGroupNearest = function (group) {

			var pois = [];
			angular.forEach(wayfinder.getKioskNode().floor.getPOIs(),
				function (element) {

					angular.forEach(element.getGroups(), function (item) {
						if (item.getName(wayfinder.getLanguage()) ===
							group.getName(wayfinder.getLanguage())) {
							pois.push(element);
						}
					});

				});
			if (pois.length == 0) {
				// console.log("no pois on kiosk floor");
				// console.log("showing way to nearest in whole building");
				pois = group.getPOIs();
			}
			if (pois == []) {
				// console.log("nearest not found");
				return;
			}
			var nearest = wayfinder.getNearestPOI(wayfinder.getKiosk(),
				pois);


			if (nearest) {
				wayfinder.showPath(nearest.getNode());
				wayfinder.statistics.onClick(nearest.id, "route");
			} else {
				console.log("Couldn't find path to nearest POI!");
			}
		};

		/*** EVENT WATCHERS ***/

		/*** ROOTSCOPE WATCHERS ***/

		$scope.$on('wf.path.finished', function (event, path) {
			angular.forEach(wayfinder.getPOIsArray(), function (item) {
				if (item.node_id == parseInt(path[path.length - 1])) {
					wayfinder.setHighlights([item]);
				}
			});
		});

		$scope.$on('wf.data.loaded', function () {
			// @ifdef type3D
			if (($.isEmptyObject(wayfinder.floorMeshes)) &&
			// @endif
			// @ifdef type2D
				if (wayfinder.building && $.isEmptyObject(wayfinder.building.getFloors()) &&
					// @endif
					$.isEmptyObject(wayfinder.pois) &&
					$.isEmptyObject(wayfinder.poiGroups) &&
					!wayfinder.kiosk) {
					$('#no-project').css({'display': 'flex', 'z-index': '999'});
					if ($scope.getGUITranslation('no-project') === 'no-project') {
						$('#no-project>p').text('Your project is empty!');
					}
					else {
						$('#no-project>p').text($scope.getGUITranslation('no-project'));
					}
				}
				else {
					$('#no-project').remove();
				}
			if (wfService.getSessionTimeout() && wfService.getSessionTimeout().$$state && wfService.getSessionTimeout().$$state.value) {
				$scope.maxInactivityTime = wfService.getSessionTimeout().$$state.value;
			}
			else {
				console.log("Didn't get session timeout - missing or not available!");
			}
		});
		$scope.$on('wf.language.change', function (event, language) {

		});
		$scope.$on('wf.map.ready', function (event) {

			$scope.loadDefaultView();
			// console.log("map ready!");
			cfpLoadingBar.complete();
			$("#loading-bar-container").remove();
			$timeout(function () {
				wayfinder.resize();
			}, 100);
			$scope.buildingLogo = (wayfinder.building.logoID ? window.location.protocol + WayfinderAPI.getURL("images", "get", wayfinder.building.logoID) : false);
			$scope.buildingTitle = wayfinder.building.name;
		});
	}
]);

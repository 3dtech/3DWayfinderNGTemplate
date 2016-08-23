

// -------------------------------------------
// --------------- Controllers ---------------
// -------------------------------------------

wayfinderApp.controller('MainController', [
  '$scope',
  '$timeout',
  '$rootScope',
  '$location',
  'wfService',
  'keyboardService',
  'wfangular3d',
  function($scope, $timeout, $rootScope, $location, wfService, keyboardService,
        wayfinder) {
        $scope.wayfinder = wayfinder;
        $scope.animationsEnabled = true;
        $scope.bold = ['\<b\>', '\<\/b\>'];

        var modalInstance;

        var lastTouch = -1;
        lastTouch = (new Date()).getTime();
        var maxInactivityTime = 3000;

        $scope.go = function(path) {
            console.debug("path:", path);
            $location.path(path);
        };

        $scope.showTopic = function(group) {
            var path = '/topics&'+group.id;
            for (var k in wfService.getTabs()) {
                if (wfService.getTabs()[k].name == "topics") {
                    wfService.setActiveTab(wfService.getTabs()[k]);
                    break;
                }
            }
            $location.path(path);
        };

        $scope.showInfo = function(poi) {
            var path = '/info&'+poi.id;
            $location.path(path);
        };

        $scope.showPath = function(poi) {
            wayfinder.showPath(poi.getNode(), poi);
        };

        $scope.getColorRGBA = function(group) {
            //Function to convert hex format to a rgb textColor
            if (!group) return;
            var rgb = group.getColor();
            var r = rgb["r"];
            var g = rgb["g"];
            var b = rgb["b"];
            var a = rgb["a"];
            var textColor = "rgba(" + parseInt(r.toString(10) * 255) + "," + parseInt(g.toString(10) * 255) + "," + parseInt(b.toString(10) * 255) + "," + parseInt(a.toString(10) * 255) + ")";
            return textColor;
        };

        /*** SCREENSAVER CONTROLS ***/

        function hideScreensaver() {
            $rootScope.$broadcast("app.screensaving", false);
            // here reset all the local variables, like menu items and stuff?jah
        };

        function showScreensaver() {
            $rootScope.$broadcast("app.screensaving", true);
            // show modal, mõttekam oleks vist mitte modal'it kasutada, sest sisu on pidevalt sama
        };

        /*** ACTIVITY CHECKER ***/

        function checker() {
            console.log("Checker! time since lastTouch", (((new Date())
                .getTime() - lastTouch) / 1000), "sec");
            var time = (new Date()).getTime();
            if (time - lastTouch > maxInactivityTime) {
                if (lastTouch > -1) {
                    onTimeout();
                } else {
                    $timeout(checker, maxInactivityTime);
                };
            } else {
                $timeout(checker, maxInactivityTime - (time - lastTouch));
            };
        };

        function onTimeout() {
            console.log("onTimeout");
            lastTouch = -1; //Disables timeouting until somebody has touched
            wayfinder.statistics.onSessionEnd();
            wayfinder.restoreDefaultState();
            showScreensaver(); //näitame seda modalit
            console.log(lastTouch);
        };

        $scope.trigger = function() {
            console.log("Trigger! time since lastTouch", (((new Date())
                .getTime() - lastTouch) / 1000), "sec");
            //reset
            if (lastTouch == -1) {
                //first click in a while
                hideScreensaver();
                wayfinder.statistics.onSessionStart();
                $timeout(checker, maxInactivityTime);
            };
            lastTouch = (new Date()).getTime();
        };

        $timeout(checker, maxInactivityTime);

        /*** SCOPE FUNCTIONS ***/

        $scope.showYAH = function() {
            wayfinder.showKiosk();
        };

        $scope.cbResizeCtrl = function() {
            wayfinder.resize();
        };

        $scope.getGUITranslation = function(key, params) {
            if (params) return wayfinder.translator.get(key);
            return wayfinder.translator.get(key, params);
        };

        $scope.setActiveTab = function(tab) {
            console.debug("WFC.setActvieTab:", tab);
            wfService.setActiveTab(tab);
        };

        $scope.getActiveTab = function() {
            return wfService.getActiveTab();
        };

        /*** EVENT WATCHERS ***/

        /*** ROOTSCOPE WATCHERS ***/

        $scope.$on();
}]);
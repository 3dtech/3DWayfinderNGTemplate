// Declare app level module which depends on filters, and services
var wayfinderApp = angular.module('app', [
	'ngRoute',
	'wfangular',
	'wf.languages',
	'wf.floors'//,
	// 'wf.zoom' // all modules go here, and into separate files and into the folder modules/<modulename>
]);

wayfinderApp.run(['wfangular3d', function(wayfinder) {
	WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
	wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
	wayfinder.open("05d899e005f24a45a7b17b7d500a24d8");
}]);

var floorsModule = angular.module('wf.floors', ['wfangular', 'wf.languages']);

floorsModule.controller('FloorsCtrl', [
    '$scope',
    'wfangular3d',
    'FloorSrv',
    'LanguagesSrv',
    function($scope, wayfinder, FloorSrv, LanguagesSrv) {
        $scope.floors = {};
        $scope.activeFloor = {};
        $scope.kioskNode = {};
        $scope.activeLanguage = {};

        $scope.$watch(
            function() {
                return LanguagesSrv.getLanguage()
            },
            function(newValue, oldValue) {
                $scope.activeLanguage = FloorSrv.getLanguage();
                console.log("watch.getLanguage(" + FloorSrv.getLanguage() + ")");
            });

        $scope.getFloor = function() {
            $scope.kioskNode = wayfinder.getKioskNode();
            console.log("getKioskNode=" + $scope.kioskNode);
            console.log("floorActiveLanguage:" + $scope.activeLanguage);
        }

        $scope.setActiveFloor = function(floor) {
            $scope.activeFloor = floor;
        }

        $scope.getActiveFloor = function() {
            return $scope.activeFloor;
        }

        $scope.setFloor = function(floor) {
        	$scope.activeFloor = floor;
        	wayfinder.showFloor(floor);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                $scope.activeLanguage = FloorSrv.getLanguage();
                $scope.kioskNode = wayfinder.getKioskNode();
                $scope.floors = wayfinder.building.getFloors();
            });
        });
    }
]);

floorsModule.service('FloorSrv', function(LanguagesSrv) {
    this.getLanguage = function() {
        return LanguagesSrv.getLanguage();
    }
});

var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
    '$scope',
    'wfangular3d',
    'LanguagesSrv',
    function($scope, wayfinder, LanguagesSrv) {
        $scope.languages = {};
        $scope.activeLanguage = {};

        $scope.getLanguage = function() {
            return LanguagesSrv.getLanguage();
        }

        $scope.getLanguages = function() {
            return LanguagesSrv.getLanguages();
        }

        $scope.setLanguage = function(language) {
            console.log("setLanguage(" + language + ")");
            $scope.activeLanguage = language;
            LanguagesSrv.setLanguage(language);
            wayfinder.setLanguage(language);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                LanguagesSrv.setLanguages(wayfinder.getLanguages());
                LanguagesSrv.setLanguage(wayfinder.getLanguage());
                $scope.languages = LanguagesSrv.getLanguages();
                $scope.activeLanguage = LanguagesSrv.getLanguage();
            });
        });
    }
]);

languagesModule.service('LanguagesSrv', function() {
    var activeLanguage = {};
    var wfLanguages = {};

    return {
        getLanguage: function() {
            return activeLanguage;
        },
        setLanguage: function(language) {
            activeLanguage = language;
        },
        getLanguages: function() {
            return wfLanguages;
        },
        setLanguages: function(languages) {
            wfLanguages = languages;
        }
    }
});


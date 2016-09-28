/**
 * Created by tonis on 28.09.16.
 */
//var groupsModule = angular.module('wf.groups', ['wfangular']);

//groupsModule.controller('GroupsCtrl', [
wfApp.controller('LanguageController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'wfService',
    'wfangular3d',
    function($rootScope, $scope, $timeout, wfService, wayfinder) {
        $scope.languages = [];

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        };

        $scope.$on("wf.language.change", function (event, language) {
            console.debug("langCtrl.lang.change:", language, $scope.languages);
            if ($scope.languages.length) {
                angular.forEach($scope.languages, function (lang) {
                    console.debug("langCtrl.lang.change.lang:", lang);
                    lang.active = lang.name == language.name;
                })
            }
        });

        $scope.setLanguage = function (language) {
            wayfinder.setLanguage(language);
        };

        $scope.$on("wf.data.loaded", function () {
            console.debug("languageController.data.loaded");
            if (!$scope.languages.length) {
                var langs = wayfinder.getLanguages();
                angular.forEach(langs, function (lang) {
                    console.debug("langCtrl.data.loaded.lang:", lang);
                    lang.active = lang.name == wayfinder.getLanguage();
                    $scope.languages.push(lang);
                })
            }
            console.debug($scope.languages);
        })
    }
]);

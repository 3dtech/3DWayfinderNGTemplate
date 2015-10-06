var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.languages = {};

        $scope.getLanguage = function() {
            return wayfinder.getLanguage();
        }

        $scope.getLanguages = function() {
            return wayfinder.getLanguages();
        }

        $scope.setLanguage = function(language) {
            wayfinder.setLanguage(language);
        }

        $scope.$on('wf.data.loaded', function(event, data) {
            $scope.$apply(function() {
                $scope.languages = wayfinder.getLanguages();
            });
        });
    }
]);


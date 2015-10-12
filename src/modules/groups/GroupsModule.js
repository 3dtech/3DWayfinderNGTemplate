var groupsModule = angular.module('wf.groups', ['wfangular']);

groupsModule.controller('GroupsGtrl', [
    '$scope',
    'wfangular3d',
    function($scope, wayfinder) {
        $scope.groups = {};

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
                $scope.groups = wayfinder.getLanguages();
            });
        });
    }
]);


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


var languagesModule = angular.module('wf.languages', ['wfangular']);

languagesModule.controller('LanguagesCtrl', [
  '$scope',
  'wfangular3d',
  function($scope, wayfinder) {
    $scope.languages = {};
    $scope.activeLanguage = {};
    $scope.activeIndex = 1;

    $scope.activateIndex = function($index) {
      console.log("language clicked[", $index, "]");
      $scope.activeIndex = $index;
    }

    $scope.getLanguage = function() {
      $scope.activeLanguage = wayfinder.getLanguage();
      return $scope.activeLanguage;
    }

    $scope.getLanguages = function() {
      return wayfinder.getLanguages();
    }

    $scope.setLanguage = function(language) {
      console.info("setLanguage", language)
      wayfinder.setLanguage(language);
      $scope.activeLanguage = language;
    }

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        setDefaults();
      };
    });

    function setDefaults() {
      $scope.activeIndex = 1;
      $scope.activeLanguage = wayfinder.getLanguage();
    }

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {
        $scope.languages = wayfinder.getLanguages();
        $scope.activeLanguage = wayfinder.getLanguage();
      });
    });
  }
]);

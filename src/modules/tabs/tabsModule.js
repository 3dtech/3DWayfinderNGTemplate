var tabsModule = angular.module('wf.tabs', ['wfangular', 'ngAnimate', 'ui.bootstrap']);

tabsModule.controller('TabsCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  'wfangular3d',
  'tabsService',
  function($scope, $rootScope, $window, wayfinder, tabsService) {
    $scope.activeTab = "default";
    $scope.tabContent = null;
    $scope.activePOI = '';

    $scope.tabs = [{
      title: 'Search',
      content: 'Search',
      alignment: 'left'
    }, {
      title: 'aToZ',
      content: 'A-Z',
      alignment: 'left'
    }, {
      title: 'Topics',
      content: 'Topics',
      alignment: 'left'
    }];

    $scope.getActiveTab = function() {
      return $scope.activeTab;
    };

    $scope.setActiveTab = function(tab) {
      $scope.activeTab = tab;
    };

    $scope.getTabNameTranslation = function(key) {
      return wayfinder.translator.get(key);
    };

    $scope.setTabContent = function(poi) {
      console.log(poi);
      tabsService.setTabContent(poi);
      $scope.tabContent = poi;
    };

    $scope.hasDescription = function(poi) {
      if (!poi) return 0;
      return poi.getDescription(wayfinder.getLanguage()) ? 1 : 0;
    }

    $scope.getTabContent = function() {
      $scope.tabContent = tabsService.getTabContent();
    };

    $scope.setActivePOI = function(str) {
      $scope.activePOI = str;
    };

    $scope.$on('app.screensaving', function(event, screensaving) {
      if (screensaving) {
        $scope.activeTab = "default";
        $scope.activePOI = '';
      };
    });

    $scope.$on('wf.tab-content.change', function() {
      console.log("tab-content.change captured! updating!");
      $scope.tabContent = tabsService.getTabContent();
      $scope.activeTab = tabsService.getActiveTab();
      console.log("new tabContent:", $scope.tabContent, "new activeTab:", $scope.activeTab);
    });

    $scope.$on('wf.data.loaded', function(event, data) {
      $scope.$apply(function() {});
    });
  }
])

tabsModule.service('tabsService', function() {
  var activeTab = "search";
  var tabContent = {};

  return {
    getActiveTab: function() {
      return activeTab;
    },
    setActiveTab: function(tab) {
      activeTab = tab;
    },
    getTabContent: function() {
      return tabContent;
    },
    setTabContent: function(content) {
      tabContent = content;
    }
  };
})

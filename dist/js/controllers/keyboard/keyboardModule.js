var keyboardModule = angular.module('wf.keyboard', ['wfangular', 'wf.languages']);

keyboardModule.controller('keyboardCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  'wfangular3d',
  function($scope, $rootScope, $http, wayfinder) {
    $http.get('layout.json').success(function(data) {
      $scope.layout = data;
    });

    $scope.keyPressed = function(value, action, $event) {
      $scope.someInput = value;
      $rootScope.$broadcast('keyPressed', $scope.someInput, action);
    };
  }
]);

keyboardModule.directive('myText', ['$rootScope', '$document', function($rootScope, $document) {
  return {
    link: function(scope, element, attrs) {
      $rootScope.$on('keyPressed', function(e, val, action) {
        var domElement = element[0];
        var triggerKeydown = function() {
          /*var e = angular.element.Event('keydown');*/
          var e = new window.KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            shiftKey: true
          });

          delete e.keyCode;
          Object.defineProperty(e, 'keyCode', {
            'value': 97
          });

          $document[0].dispatchEvent(e)
            /*e.which = keycode;
            element.trigger(e);*/
        };
            triggerKeydown();

        if (document.selection) {
          domElement.focus();
          var sel = document.selection.createRange();
          sel.text = val;
          domElement.focus();
        } else if (domElement.selectionStart || domElement.selectionStart === 0) {
          var startPos = domElement.selectionStart;
          var endPos = domElement.selectionEnd;
          var scrollTop = domElement.scrollTop;

          if (action === 'del') {
            if (startPos === endPos) {
              domElement.value = domElement.value.substring(0, startPos - 1) + domElement.value.substring(endPos, domElement.value.length);
              domElement.focus();
              domElement.selectionStart = startPos - 1;
              domElement.selectionEnd = startPos - 1;
            } else {
              domElement.value = domElement.value.substring(0, startPos) + domElement.value.substring(endPos, domElement.value.length);
              domElement.focus();
              domElement.selectionStart = startPos;
              domElement.selectionEnd = startPos;
            }

            domElement.scrollTop = scrollTop;
          } else if (action == 'enter') {
            triggerKeydown();
          } else {
            domElement.value = domElement.value.substring(0, startPos) + val + domElement.value.substring(endPos, domElement.value.length);
            domElement.focus();
            domElement.selectionStart = startPos + val.length;
            domElement.selectionEnd = startPos + val.length;
            domElement.scrollTop = scrollTop;
          }
        } else {
          domElement.value += val;
          domElement.focus();
        }
      });
    }
  }
}]);

keyboardModule.directive('myEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.myEnter);
        });

        event.preventDefault();
      }
    });
  };
});

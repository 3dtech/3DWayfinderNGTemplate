wfApp.directive('floorButton', function() {
	return {
		restrict: 'E',
		scope: {
			floor: '='
		},
		templateUrl: 'js/directives/floorButton.html'
	}
});
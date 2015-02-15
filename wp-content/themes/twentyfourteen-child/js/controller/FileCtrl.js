app.controller('fileCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.setCurrentFile($stateParams.idx);
	$scope.tabs = [{ title:'Diagram', id: 1, route: 'home.file.diagram', idx: $stateParams.idx}, { title:'Flat', id: 2, route: 'home.file.flatview', idx: $stateParams.idx} ];
	
	$scope.selectTab = function(route, idx) {
		$scope.$state.go(route, idx);
	}
}]);


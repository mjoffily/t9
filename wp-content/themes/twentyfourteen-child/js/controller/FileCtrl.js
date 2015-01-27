app.controller('fileCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.setCurrentFile($stateParams.idx);
	//alert($scope.data[$scope.data.length - 1].envName)
}]);


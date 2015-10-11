app.controller('loginCtrl', ['$scope', '$modalInstance', '$modal', function($scope, $modalInstance, $modal) {

	$scope.ok = function() {
		$modalInstance.close(1);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
}]);

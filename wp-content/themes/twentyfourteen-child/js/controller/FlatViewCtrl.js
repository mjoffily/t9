app.controller('flatViewCtrl', ['$scope', '$stateParams', 'titleFilter', 'valueFilter', function($scope, $stateParams, titleFilter, valueFilter) {
	$scope.searchname = "";
	$scope.searchvalue = "";
	$scope.searchtitle = "";
	
	// set the file selected in case the user came directly to this URL without selecting the file in the dropdown
	$scope.file = $scope.data[$stateParams.idx].nodes;
	
	// get the nodes list (flattned) to work with
	$scope.flatnodes = $scope.dataflat[$stateParams.idx].flatnodes;
	
	// initialise the number of columns in the grid to 4
	// TODO move this to some user specific environment setting
	$scope.numColumns = 4;
	
	// initialise the filtered nodes to be all of them (no filter applied yet)
	$scope.filterednodes = $scope.flatnodes;
	
	// watch the search criteria entered by the user on the filter  title field and apply filter
	$scope.$watch('searchtitle', function() {
		$scope.filter();
	});
	$scope.$watch('searchname', function() {
		$scope.filter();
	});
	$scope.$watch('searchvalue', function() {
		$scope.filter();
	});

	$scope.filter = function() {
		$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);
//		$scope.filterednodes = nameFilter($scope.filterednodes, $scope.searchname);
		$scope.filterednodes = valueFilter($scope.filterednodes, $scope.searchvalue);
	}
	
	$scope.columns = function() {
		return new Array(Number($scope.numColumns));
	};
	
	$scope.rows = function(num) {
		if (!$scope.isNumeric(num)) {
			num = 4;
		}
		var ret = 0;
		var div = Math.floor($scope.filterednodes.length / num);
		var mod = $scope.filterednodes.length % num;
		if (div < 1) {
			ret = 1;
		}
		else if (mod !== 0) {
			ret = div + 1;
		}
		else {
			ret = div;
		}
		console.log('My ROWS ' + (ret));

		return new Array(ret);
	};

	$scope.addRow = function(idx) {
		$scope.flatnodes[idx].metadata.push({
			name: "newname",
			value: "newvalue"
		});
	};
	$scope.removeRow = function(d) {
		$scope.flatnodes[idx].metadata.splice(d, 1);
	};
	
 	$scope.isNumeric = function(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
}]);

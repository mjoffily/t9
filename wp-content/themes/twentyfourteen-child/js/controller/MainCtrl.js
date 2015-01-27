app.controller('mainCtrl', ['$scope', 't9Service', '$state', '$stateParams', function($scope, t9Service, $state, $stateParams) {
    $scope.currentFile;
    $scope.selectedFileIndex;

	t9Service.getData().then(function(response) {
		$scope.data = response.data;
		// array to hold the data in a flat format
		$scope.dataflat = new Array($scope.data.length);
		$scope.flattenFiles($scope.data);
	});

	$scope.flattenFiles = function(arr) {
		for (var i = 0; i < arr.length; i++) {
			$scope.dataflat[i] = {
				flatnodes: []
			};
			$scope.flattenNodes($scope.dataflat[i], arr[i].nodes);
		}
	};

	$scope.flattenNodes = function(destinationArray, sourceArray) {
		for (var j = 0; j < sourceArray.length; j++) {
			var node = sourceArray[j];
			if (node.type === 'node') {
				destinationArray.flatnodes.push(node);
				if (node.children.length > 0) {
					$scope.flattenNodes(destinationArray, node.children);
				}
			}
		}
	}
	  
	$scope.setCurrentFile = function(idx) {
    	$scope.currentFile = $scope.data[idx];
    	$scope.selectedFileIndex = idx;
	};
	
    $scope.goToPage = function (idx) {
    	if (idx === "-1") {
    		$scope.newFile();
    		return;
    	}
    	if (idx === "") {
    		return;
    	}
    	$scope.setCurrentFile(idx);
    	$state.go('home.file.diagram', {idx: idx});
    };

	$scope.newFile = function() {
		var a = {
			"envId": 1,
			"envName": "unnamed",
			"nodes": []
		};
		var dataArrayLength = $scope.data.push(a);

		// set this as the current file
		$scope.setCurrentFile(dataArrayLength - 1);
		$scope.dataflat.push({flatnodes: []});
	};

	$scope.addNewNode = function(idx) {
		var a = {
			id: 10,
			type: 'node',
			title: 'new entry',
			width: 0,
			height: 0,
			formatting: {
				strokeWidth: 2,
				showas: 'rectangle',
				borderColor: 'black',
				fill: '#B19CD8',
				fontFamily: 'Verdana, Geneva, sans-serif',
				fontColor: '#FFFFFF',
				fontSize: 10,
				level: 0
			},
			metadata: [],
			children: []
		};
		$scope.data[idx].nodes.splice(0, 0, a);
		$scope.dataflat[idx].flatnodes.push(a);
	};

	$scope.addNewLineBreak = function(idx) {
		var a = {
			id: 10,
			type: 'formatting',
			title: 'linebreak',
			formatting: {
				height: 10
			},
			children: []
		};
		$scope.data[idx].nodes.splice(0, 0, a);
	};

	$scope.newSubItem = function(scope, idx) {
		var parentNode = scope.$modelValue;
		var newNode = {
			id: parentNode.id * 10 + parentNode.children.length,
			type: parentNode.type,
			title: parentNode.title + '.' + (parentNode.children.length + 1),
			width: 0,
			height: 0,
			formatting: {
				strokeWidth: 2,
				showas: 'rectangle',
				borderColor: 'black',
				fill: '#B19CD8',
				fontFamily: 'Verdana, Geneva, sans-serif',
				fontColor: '#FFFFFF',
				fontSize: 10,
				level: parentNode.formatting.level + 1
			},
			metadata: [],
			children: []
		};
		parentNode.children.push(newNode);
		$scope.dataflat[idx].flatnodes.push(newNode);

	};

	$scope.collapseAll = function() {
		$scope.$broadcast('collapseAll');
	};

	$scope.expandAll = function() {
		$scope.$broadcast('expandAll');
	};

}]);

app.controller('mainCtrl', ['$scope', 't9Service', '$state', '$stateParams', '$q', function($scope, t9Service, $state, $stateParams, $q) {
	$scope.currentFile;
	$scope.selectedFileIndex;
	$scope.currentNode;
	$scope.flatNodesForSelectedFile = [];
	$scope.flatIndexedNodesForSelectedFile = [];

	$scope.checkAndHandleLocalStorageResult = function(result) {
		if (result.data !== "no data") {
			var deferred = $q.defer();
			deferred.resolve(result);
			return deferred.promise;
		}
		return t9Service.getDataFromServer();
	};

	var p1 = t9Service.getDataFromLocalStorage();
	var p2 = p1.then($scope.checkAndHandleLocalStorageResult);
	p2.then(function(response) {
		$scope.data = response.data;
		// array to hold the data in a flat format
		$scope.dataflat = new Array($scope.data.length);
		$scope.flattenFiles($scope.data);
	});

	$scope.flattenFiles = function(arr) {
		for (var i = 0; i < arr.length; i++) {
			$scope.dataflat[i] = {
				flatnodes: [],
				flatindexedNodes: []
			};
			$scope.flattenNodes($scope.dataflat[i], arr[i].nodes, undefined);
		}
	};

	// $scope.linkToParent = function(objArr, parentObj) {
	// 	for (var i = 0; i < objArr.length; i++) {
	// 		var node = objArr[i];
	// 		$scope.dataflat[$scope.selectedFileIndex].flatnodes[node.id].parent = parentObj;
	// 		if (node.children.length > 0) {
	// 			$scope.linkToParent(node.children, node);
	// 		}
	// 	}
	// }

	$scope.save = function() {
		localStorage.t9 = JSON.stringify($scope.data);
	}

	// lets traverse the tree structure to flatten it and store the parent of each node for easy access
	// We cannot have add the parent to the tree object as it causes stack overflow
	// when transforming to json and on angular $digest cycle
	// We will use this flat array when dragging and dropping objects and changing parents and
	// sibilings.
	$scope.flattenNodes = function(destinationArray, sourceArray, parent) {
		for (var j = 0; j < sourceArray.length; j++) {
			var node = sourceArray[j];
			destinationArray.flatindexedNodes[node.id] = {node: node, parent: parent};
			if (node.type === 'node') {
				destinationArray.flatnodes.push(node);
				if (node.children.length > 0) {
					$scope.flattenNodes(destinationArray, node.children, node);
				}
			}
		}
	}

	$scope.setCurrentFile = function(idx) {
		$scope.currentFile = $scope.data[idx];
		$scope.selectedFileIndex = idx;
		$scope.flatNodesForSelectedFile = $scope.dataflat[$scope.selectedFileIndex].flatnodes;
		$scope.flatIndexedNodesForSelectedFile = $scope.dataflat[$scope.selectedFileIndex].flatindexedNodes;

//		$scope.linkToParent($scope.currentFile.nodes, undefined);
	};

	// traverse all nodes. Along the way find the selected one and mark it "nodeselected = true". 
	// mark the other nodes with "nodeselected = false"
	// this variable is used to highlight on the screen the node clicked on, both on the diagram and on the node tree.
	$scope.findNode = function(id) {
		
		for (var i = 0; i < $scope.flatNodesForSelectedFile.length; i++) {
			$scope.flatNodesForSelectedFile[i].formatting.nodeselected = false;
		}
		$scope.currentNode = $scope.flatIndexedNodesForSelectedFile[id].node;
		$scope.currentNode.formatting.nodeselected = true;
		$scope.$apply();
	};


	$scope.goToPage = function(idx) {
		if (idx === "-1") {
			$scope.newFile();
			return;
		}
		if (idx === "") {
			return;
		}
		$scope.setCurrentFile(idx);
		$state.go('home.file.diagram', {
			idx: idx
		});
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
		$scope.dataflat.push({
			flatnodes: []
		});
	};

	$scope.getNextId = function() {
		var id = $scope.data[$scope.selectedFileIndex].maxId;
		id = id + 1;
		$scope.data[$scope.selectedFileIndex].maxId = id;
		return id;
	};

	$scope.addNewNode = function() {
		var a = {
			id: $scope.getNextId(),
			type: 'node',
			title: 'new entry',
			formatting: {
				strokeWidth: 2,
				width: 100,
				height: 100,
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
		$scope.data[$scope.selectedFileIndex].nodes.splice(0, 0, a);
		$scope.dataflat[$scope.selectedFileIndex].flatnodes.push(a);
		$scope.dataflat[$scope.selectedFileIndex].flatindexedNodes[a.id] = {node: a, parent: undefined};
	};

	$scope.addNewLineBreak = function() {
		var a = {
			id: $scope.getNextId(),
			type: 'formatting',
			title: 'linebreak',
			formatting: {
				height: 10
			},
			children: []
		};

		// if we have a current node, we want to add the line break as a child to it
		// else, we put it as the first node
		if ($scope.currentNode) {
			$scope.currentNode.children.push(a);
		}
		else {
			$scope.data[$scope.selectedFileIndex].nodes.splice(0, 0, a);
		}
	};

	$scope.newSubItem = function(scope, idx) {
		//		var parentNode = scope.$modelValue;
		var parentNode = $scope.currentNode;
		var newNode = {
			id: $scope.getNextId(),
			type: parentNode.type,
			title: parentNode.title + '.' + (parentNode.children.length + 1),
			formatting: {
				strokeWidth: 2,
				showas: 'rectangle',
				borderColor: 'black',
				width: 0,
				height: 0,
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
		$scope.dataflat[$scope.selectedFileIndex].flatnodes.push(newNode);

	};


	$scope.collapseAll = function() {
		$scope.$broadcast('collapseAll');
	};

	$scope.expandAll = function() {
		$scope.$broadcast('expandAll');
	};

}]);

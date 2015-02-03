app.controller('mainCtrl', ['$scope', 't9Service', '$state', '$stateParams', '$q', function($scope, t9Service, $state, $stateParams, $q) {
	$scope.currentFile;
	$scope.selectedFileIndex;
	$scope.currentNode;

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
				flatnodes: []
			};
			$scope.flattenNodes($scope.dataflat[i], arr[i].nodes);
		}
	};

	$scope.linkToParent = function(objArr, parentObj) {
		for (var i = 0; i < objArr.length; i++) {
			obj = objArr[i];
			obj.parent = parentObj;
			if (obj.children.length > 0) {
				$scope.linkToParent(obj.children, obj);
			}
		}
	}

	$scope.unlinkParent = function(objArr) {
		for (var i = 0; i < objArr.length; i++) {
			obj = objArr[i];
			obj.parent = undefined;
			if (obj.children.length > 0) {
				$scope.unlinkParent(obj.children);
			}
		}
	}
	
	$scope.save = function() {
		// before converting to Json, remove references to parent or it will
		// go into infinite loop
		for (var i = 0; i < $scope.data.length; i++) {
			$scope.unlinkParent($scope.data[i]);
		}

		localStorage.t9 = JSON.stringify($scope.data);
	}

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
		$scope.linkToParent($scope.currentFile, undefined);
	};

	// traverse all nodes. Along the way find the selected one and mark it "nodeselected = true". 
	// mark the other nodes with "nodeselected = false"
	// this variable is used to highlight on the screen the node clicked on, both on the diagram and on the node tree.
	$scope.findNode = function(id, allNodes) {
		for (var i = 0; i < allNodes.length; i++) {
			var n = allNodes[i];
			if (n.id === id) {
				$scope.currentNode = n;
				$scope.currentNode.formatting.nodeselected = true;
			}
			else {
				n.formatting.nodeselected = false;
			}
			if (n.children.length > 0) {
				$scope.findNode(id, n.children);
			}
		}
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

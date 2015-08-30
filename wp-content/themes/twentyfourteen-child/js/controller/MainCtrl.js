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
	// 		$scope.flatNodesForSelectedFile[node.id].parent = parentObj;
	// 		if (node.children.length > 0) {
	// 			$scope.linkToParent(node.children, node);
	// 		}
	// 	}
	// }

	$scope.save = function() {
		localStorage.t9 = JSON.stringify($scope.data);
	}

	// lets traverse the tree structure to flatten it and store the parent of each node for easy access
	// We cannot add the parent to the tree object as it causes stack overflow
	// when transforming to json and on angular $digest cycle
	// We will use this flat array when dragging and dropping objects and changing parents and
	// sibilings.
	$scope.flattenNodes = function(destinationArray, sourceArray, parent) {
		for (var j = 0; j < sourceArray.length; j++) {
			var node = sourceArray[j];
			destinationArray.flatindexedNodes[node.id] = {node: node, parent: parent};
//			if (node.type === 'node') {
				destinationArray.flatnodes.push(node);
				if (node.children.length > 0) {
					$scope.flattenNodes(destinationArray, node.children, node);
				}
//			}
		}
	}

	$scope.setCurrentFile = function(idx) {
		$scope.currentFile = $scope.data[idx];
		$scope.selectedFileIndex = idx;
		$scope.flatNodesForSelectedFile = $scope.dataflat[$scope.selectedFileIndex].flatnodes;
		$scope.flatIndexedNodesForSelectedFile = $scope.dataflat[$scope.selectedFileIndex].flatindexedNodes;
	};

	// traverse all nodes. Along the way find the selected one and mark it "nodeselected = true". 
	// mark the other nodes with "nodeselected = false"
	// this variable is used to highlight on the screen the node clicked on, both on the diagram and on the node tree.
	$scope.findNode = function(id, apply) {
		
		for (var i = 0; i < $scope.flatNodesForSelectedFile.length; i++) {
			$scope.flatNodesForSelectedFile[i].formatting.nodeselected = false;
		}
		$scope.currentNode = $scope.flatIndexedNodesForSelectedFile[id].node;
		$scope.currentNode.formatting.nodeselected = true;
		if (apply) {
			$scope.$apply();
		}
	};

	$scope.findNodeInMap = function(id) {
		return $scope.flatIndexedNodesForSelectedFile[id].node;
	};


	$scope.goToFile = function(idx) {
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
			"maxId": 0,
			"envName": "unnamed",
			"nodes": []
		};
		var dataArrayLength = $scope.data.push(a);
		var idx = dataArrayLength - 1;
		
		$scope.dataflat.push({
			flatnodes: [],
			flatindexedNodes: []
		});
		// set this as the current file
		$scope.setCurrentFile(idx);
		$scope.goToFile(idx);
	};

	$scope.getNextId = function() {
		var id = $scope.data[$scope.selectedFileIndex].maxId;
		id = id + 1;
		$scope.data[$scope.selectedFileIndex].maxId = id;
		return id;
	};

	$scope.getNewNode = function() {
		var id = $scope.getNextId(); 
		var a = {
			id: id,
			type: 'node',
			title: id + '',
			formatting: {
				strokeWidth: 2,
				width: 100,
				height: 100,
				fillOpacity: 1.0,
				visible: true,
				showas: 'rectangle',
				borderColor: 'black',
				fill: '#B19CD8',
				fontFamily: 'Verdana',
				fontColor: '#FFFFFF',
				textStrokeWidth: 0,
				fontSize: 10,
				level: 0
			},
			metadata: [],
			children: []
		};
		return a;
	};
	
	$scope.addNewNodeAsSibiling = function() {
		// add node as a sibiling to the selected node
		if ($scope.currentNode) {
			var a = $scope.getNewNode();
			
			// inherit characteristics of currently selected node
			a.formatting.strokeWidth = $scope.currentNode.formatting.strokeWidth;
			a.formatting.width       = $scope.currentNode.formatting.width;
			a.formatting.height = $scope.currentNode.formatting.height;
			a.formatting.showas = $scope.currentNode.formatting.showas;
			a.formatting.borderColor = $scope.currentNode.formatting.borderColor;
			a.formatting.fill	 = $scope.currentNode.formatting.fill;
			a.formatting.fontFamily	 = $scope.currentNode.formatting.fontFamily;
			a.formatting.fontColor	 = $scope.currentNode.formatting.fontColor;
			a.formatting.textStrokeWidth	 = $scope.currentNode.formatting.textStrokeWidth;
			a.formatting.fontSize	 = $scope.currentNode.formatting.fontSize;
			a.formatting.level	 = $scope.currentNode.formatting.level;
	
			
			// find parent of selected node
			var parent = $scope.getParent($scope.currentNode.id);
			if (parent) { // find the position of the selected node under the parent and move the new node as a sibiling
				var pos = $scope.findNodeInArray($scope.currentNode.id, parent.children); 
				parent.children.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: parent};

			} else { // no parent - add node to top of tree next to selected node
				pos = $scope.findNodeInArray($scope.currentNode.id, $scope.data[$scope.selectedFileIndex].nodes); 
				$scope.data[$scope.selectedFileIndex].nodes.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
			}
			$scope.flatNodesForSelectedFile.push(a);
			$scope.findNode(a.id, false);
		} else {
			$scope.addNewNode();
		}
	};
	
	$scope.addNewNode = function() {
		var a = $scope.getNewNode();
		$scope.data[$scope.selectedFileIndex].nodes.splice(0, 0, a);
		$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
		$scope.flatNodesForSelectedFile.push(a);
		$scope.findNode(a.id, false);
	};

	$scope.deleteNode = function() {
		$scope.delete($scope.currentNode.id, $scope.data[$scope.selectedFileIndex].nodes);
	}
	
	$scope.delete = function(id, arr) {
		for (var i = 0; i < arr.length; i++) { // delete from tree array and from flat and flat indexed arrays too
			if (arr[i].id === id) {
				$scope.deleteChildren(arr[i].children);
				for (var j = 0; j < $scope.flatNodesForSelectedFile.length; j++) {
					if ($scope.flatNodesForSelectedFile[j].id === arr[i].id) {
						$scope.flatNodesForSelectedFile.splice(j, 1);
						break;
					}
				}
				
				$scope.flatIndexedNodesForSelectedFile[arr[i].id] = {};
				arr.splice(i, 1);
				break;
			} else if (arr[i].children.length > 0) {
				$scope.delete(id, arr[i].children);
			}
		}
	}
	
	$scope.deleteChildren = function(arr) {
		for (var i = 0; i < arr.length; i++) { 
			if (arr[i].children.length > 0) {
				$scope.deleteChildren(arr[i].children);
			} 
			
			for (var j = 0; j < $scope.flatNodesForSelectedFile.length; j++) {
				if ($scope.flatNodesForSelectedFile[j].id === arr[i].id) {
					$scope.flatNodesForSelectedFile.splice(j, 1);
					break;
				}
			}
			$scope.flatIndexedNodesForSelectedFile[arr[i].id] = {};
		}
	}

	$scope.getParent = function(nodeId) {
		return $scope.flatIndexedNodesForSelectedFile[nodeId].parent
	} 
	
	$scope.findNodeInArray = function(nodeId, arr) {
		var pos = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id === nodeId) {
				pos = i;
				break;
			}
		}
		return pos;
	} 
	
	
	$scope.addNewLineBreak = function(isInside) {
		var a = {
			id: $scope.getNextId(),
			type: 'formatting',
			title: 'linebreak',
			formatting: {
				height: 10,
				width: 20
			},
			children: []
		};

		// 
		// 
		if (isInside) { // user has requested a linebreak inside the currentnode
			$scope.currentNode.children.push(a);
			$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: $scope.currentNode};
		} else { // user has requested a linebreak as sibiling of currentnode
			var parent = $scope.getParent($scope.currentNode.id);
			if (parent) { // if has parent, add the line break to the children array, next to current node
				var pos = $scope.findNodeInArray($scope.currentNode.id, parent.children);
				parent.children.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: parent};
			} else { // does not have a parent. find the current Node at the top level array and add line break next
				pos = $scope.findNodeInArray($scope.currentNode.id, $scope.data[$scope.selectedFileIndex].nodes);
				$scope.data[$scope.selectedFileIndex].nodes.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
			}
		}
		// push to the end of flat nodes
		$scope.flatNodesForSelectedFile.push(a);
	};

	$scope.newSubItem = function(scope, idx) {
		var parentNode = $scope.currentNode;
		var id = $scope.getNextId();
		var newNode = {
			id: id,
			type: parentNode.type,
			title: id + '',
			formatting: {
				strokeWidth: 2,
				showas: 'rectangle',
				borderColor: 'black',
				visible: true,
				width: 0,
				height: 0,
				fillOpacity: 1.0,
				fill: '#B19CD8',
				fontFamily: 'Verdana',
				fontColor: '#FFFFFF',
				textStrokeWidth: 0,
				fontSize: 10,
				level: parentNode.formatting.level + 1
			},
			metadata: [],
			children: []
		};
		parentNode.children.push(newNode);
		$scope.flatNodesForSelectedFile.push(newNode);
		$scope.flatIndexedNodesForSelectedFile[newNode.id] = {node: newNode, parent: parentNode};

	};
}]);

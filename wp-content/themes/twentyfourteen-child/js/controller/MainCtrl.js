/* global app*/
/* global SiteParameters*/

app.controller('mainCtrl', ['$scope', 't9Service', '$state', '$stateParams', '$q', '$modal', '$log', function($scope, t9Service, $state, $stateParams, $q, $modal, $log) {
	$scope.currentFile;
	$scope.selectedFileIndex;
	$scope.currentNode;
	$scope.flatNodesForSelectedFile = [];
	$scope.flatIndexedNodesForSelectedFile = [];
	$scope.user = 'mjoffily';
	$scope.serverRootLocation = SiteParameters.theme_directory;
	$scope.fileList;
	$scope.loading = false;
	$scope.debugOn = false;
	$scope.showJson = false;
	$scope.showOutline = false;
	$scope.undoStack = [];
	
	$scope.checkAndHandleLocalStorageResult = function(result) {
		if (result.data !== "no data") {
			var deferred = $q.defer();
			deferred.resolve(result);
			return deferred.promise;
		}
		return t9Service.getDataFromServer();
	};

//	var p1 = t9Service.getDataFromLocalStorage();
	$scope.loading = true;
	var p1 = t9Service.getListOfFilesFromServer($scope.user);
	p1.then(function(result) {
		$scope.fileList = result.data.files;
	}).finally(function() {
		$scope.loading = false;
	});

	
	// p2.then(function(response) {
	// 	$scope.data = response.data;
	// 	// array to hold the data in a flat format
	// 	$scope.dataflat = new Array($scope.data.length);
	// 	$scope.flattenFiles($scope.data);
	// });

	$scope.flattenFile = function(nodes, parent) {
		$scope.dataflat = {
			flatnodes: [],
			flatindexedNodes: []
		};
		$scope.flattenNodes($scope.dataflat, nodes, undefined);
	};

	$scope.save = function() {
		$scope.loading = true;
		var promise = t9Service.fileSave($scope.user, $scope.currentFile);
		promise.then(function(res) {
			$scope.currentFile.id = res.data.file_id;
		}).finally(function() {
			$scope.loading = false;
		});
//localStorage.t9 = JSON.stringify($scope.data);
	}

	// lets traverse the tree structure to flatten it and store the parent of each node for easy access
	// We cannot add the parent to the tree object as it causes stack overflow
	// when transforming to json and on angular $digest cycle
	// We will use this flat array when dragging and dropping objects and changing parents and
	// sibilings.
	$scope.flattenNodes = function(flatArray, nodes, parent) {
		for (var j = 0; j < nodes.length; j++) {
			var node = nodes[j];
			flatArray.flatindexedNodes[node.id] = {node: node, parent: parent};
			flatArray.flatnodes.push(node);
			if (node.children.length > 0) {
				$scope.flattenNodes(flatArray, node.children, node);
			}
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

	$scope.addMargins = function(nodes) {
		// temporary fix to set new formatting fields
		for (var i = 0; i<nodes.length; i++) {
			var node = nodes[i];
			if (node.type === "node") {
				if (node.children.length > 0) {
					$scope.addMargins(node.children);
				}
				node.formatting.marginLeft = 10;
				node.formatting.marginRight = 0;
			}
		}
	};

	$scope.fileOpen = function(idx) {
		if (idx === "") {
			return;
		}
		$scope.loading = true;
		var promise = t9Service.fileOpen($scope.user, $scope.fileList[idx].id);
		promise.then(function(result) {
			$scope.currentFile = result.data;
			$scope.currentFile.svg_width = +$scope.currentFile.svg_width;
			$scope.currentFile.svg_height = +$scope.currentFile.svg_height;
			if ($scope.currentFile.svg_width === 0) {
				$scope.currentFile.svg_width = 1200;
			}
			if ($scope.currentFile.svg_height === 0) {
				$scope.currentFile.svg_height = 1200;
			}
			// TODO remove this
			$scope.addMargins($scope.currentFile.nodes);
			$scope.flatten();
			$state.go('home.file.diagram', {
				idx: idx
			});
		}).finally(function() {
			$scope.loading = false;
		});
	};
	
	$scope.flatten = function() {
		$scope.flattenFile($scope.currentFile.nodes, undefined);
		$scope.flatNodesForSelectedFile = $scope.dataflat.flatnodes;
		$scope.flatIndexedNodesForSelectedFile = $scope.dataflat.flatindexedNodes;
	};

	$scope.fileNew = function() {
		
		//TODO add logic to save and close current file
		// broadcast message so the house keeping can take place:

		$scope.$broadcast ('fileNew');
		var a = {
			"id": -1,
			"max_node_id": 0,
			"svg_height":800,
    		"svg_width":1200,
    			"file_name": "unnamed",
			"nodes": []
		};
		
		// set this as the current file
		$scope.currentFile = a;
		$scope.currentFile.svg_width = +$scope.currentFile.svg_width;
		$scope.currentFile.svg_height = +$scope.currentFile.svg_height;
		if ($scope.currentFile.svg_width === 0) {
			$scope.currentFile.svg_width = 1200;
		}
		if ($scope.currentFile.svg_height === 0) {
			$scope.currentFile.svg_height = 1200;
		}
			
		$scope.flatten();

		$state.go('home.file.diagram', {
			idx: -1
		});
	};

	$scope.fileClose = function() {
		
		//TODO add logic to save and close current file
		// broadcast message so the house keeping can take place:

		$scope.$broadcast ('fileClose');

		// set this as the current file
		$scope.currentFile = undefined;
		$scope.flatNodesForSelectedFile = undefined;
		$scope.flatIndexedNodesForSelectedFile = undefined;

		$state.go('home');

	};

	$scope.getNextId = function() {
		var id = $scope.currentFile.max_node_id;
		id = +id + +1;
		$scope.currentFile.max_node_id = id;
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
				marginLeft: 10,
				marginRight: 0,
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
	
	$scope.addToUndoStack = function(description) {
		var undoObj = {"description": description};
		undoObj.nodes = JSON.parse(JSON.stringify($scope.currentFile.nodes));
		$scope.undoStack.push(undoObj);
	};
	
	$scope.undo = function() {
		var undoObj = $scope.undoStack.pop();
		$scope.currentFile.nodes = JSON.parse(JSON.stringify(undoObj.nodes));
		$scope.flatten();
		$scope.$broadcast ('undo');
	};
	
	$scope.addNewNodeAsSibiling = function() {

		// add node as a sibiling to the selected node
		if ($scope.currentNode) {
			// copy nodes to undo stack before making the change
			$scope.addToUndoStack("add new node as sibiling");

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
				pos = $scope.findNodeInArray($scope.currentNode.id, $scope.currentFile.nodes); 
				$scope.currentFile.nodes.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
			}
			$scope.flatNodesForSelectedFile.push(a);
			$scope.findNode(a.id, false);
		} else {
			$scope.addNewNode();
		}
	};
	
	$scope.addNewNode = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("add new node");

		var a = $scope.getNewNode();
		$scope.currentFile.nodes.splice(0, 0, a);
		$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
		$scope.flatNodesForSelectedFile.push(a);
		$scope.findNode(a.id, false);
	};

	$scope.deleteNode = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("delete node");

		// find the node that should become the "current" once the current 
		// is deleted. Use this precedence rule:
		// 1. sibiling to the left
		// 2. sibiling to the right
		// 3. parent node
		var node = $scope.findSibiling($scope.currentNode.id, -1);
		if (!node) {
			node = $scope.findSibiling($scope.currentNode.id, 1);
		}
		if (!node) {
			node = $scope.getParent($scope.currentNode.id);
		}
		$scope.delete($scope.currentNode.id, $scope.currentFile.nodes);
		if (node) {
			$scope.currentNode = node
			$scope.currentNode.formatting.nodeselected = true; 
		} else {
			$scope.currentNode = undefined;
		}
	}

	/*
	 * leftRightChoice can be 1 or -1.
	 * 1 will return sibiling to the right in the array
	 * -1 will return sibiling to the left in the array
	 * if no sibiling exists, returns null
	*/
	$scope.findSibiling = function(nodeId, leftRightChoice) {
		var parent = $scope.getParent(nodeId);
		var pos = -1;
		var arr = [];
		if (parent) {
			arr = parent.children;
		} else {
			arr = $scope.currentFile.nodes;
		}
		// if there is only this node in the array, it has no sibilings
		if (arr.length === 1) {
			return null;
		}
		pos = $scope.findNodeInArray(nodeId, arr);
		// if no sibiling to the left and no sibiling to the right return null
		if ((pos === 0 && leftRightChoice === -1) || (pos === (arr.length - 1) && leftRightChoice === 1)) {
			return null;
		} 
		return arr[pos + leftRightChoice];
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
				height: 0,
				width: 0
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
				pos = $scope.findNodeInArray($scope.currentNode.id, $scope.currentFile.nodes);
				$scope.currentFile.nodes.splice(pos + 1, 0, a);
				$scope.flatIndexedNodesForSelectedFile[a.id] = {node: a, parent: undefined};
			}
			// update currentNode to force redraw
			if ($scope.currentNode.dummyField) {
				$scope.currentNode.dummyField = $scope.currentNode.dummyField + 1;
			} else {
				$scope.currentNode.dummyField = $scope.currentNode.dummyField = 0;
			}
		}
		// push to the end of flat nodes
		$scope.flatNodesForSelectedFile.push(a);
	};

	$scope.newSubItem = function(scope, idx) {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("add new node as a child");

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
	$scope.login = function() {

    var modalInstance = $modal.open({
      templateUrl: 'loginn.html',
      backdrop: false,
      controller: 'loginCtrl'
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

	$scope.toggleDebug = function() {
		$scope.debugOn = !$scope.debugOn;
		 $scope.$broadcast ('redraw');
	};

	$scope.toggleJson = function() {
		$scope.showJson = !$scope.showJson;
	}

	$scope.toggleOutline = function() {
		$scope.showOutline = !$scope.showOutline;
		$scope.$broadcast ('redraw');
	}

}]);

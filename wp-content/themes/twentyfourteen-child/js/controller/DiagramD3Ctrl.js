app.controller('diagramCtrl', ['$scope', '$parse', '$stateParams', '$mdSidenav', '$log', 't9Service', 'titleWithMapFilter', 'attributeNameFilter', 'attributeValueFilter', function($scope, $parse, $stateParams, $mdSidenav, $log, t9Service, titleWithMapFilter, attributeNameFilter, attributeValueFilter) {

	$scope.groups = new Array();
	$scope.tops = 0;
	$scope.debugOn = false;
	$scope.minWidth = 1;
	$scope.minHeight = 1;
	$scope.defaultWidth = 50;
	$scope.defaultHeight = 50;
	$scope.textPadding = 20;
	$scope.padding = 10;
	$scope.topPadding = 30;
	$scope.editorEnabled = false;
	$scope.showJson = false;
	$scope.showOutline = false;
	$scope.showControls = true;
	$scope.propertiesTemplate = SiteParameters.theme_directory + '/js/partials/popup.html';
	$scope.shapes = ['rectangle', 'circle', 'triangle', 'elipse'];
	$scope.filter = {
		filterOptions: [{
			id: 1,
			text: 'title contains'
		}, {
			id: 2,
			text: 'has attribute with name...'
		}, {
			id: 3,
			text: 'has attribute with value...'
		}],
		currentFilterCriteria: [],
		filterOn: false
	};
	$scope.holder = []; // holdings list of overlapping objects during drag event
	$scope.draggingInProgress = false; // flag to prevent redrawing when draggring is in progress
	$scope.referencesPerLevel = [];
	$scope.file = $scope.data[$stateParams.idx].nodes;
	$scope.dragdrophelper = {
		initial: {},
		threshold: {
			min: {
				x: 0,
				y: 0
			},
			max: {
				x: 0,
				y: 0
			},
			isNeeded: true
		},
		offsetCircleCentre: 15
	};

	$scope.toggleRight = function() {
		$mdSidenav('right').toggle()
			.then(function() {
				$log.debug("toggle RIGHT is done");
			});
	};

	$scope.addFilterCriteria = function() {
		$scope.filter.currentFilterCriteria.push({
			id: '?',
			text: ''
		});
	};
	$scope.deleteFilterCriteria = function(i) {
		$scope.filter.currentFilterCriteria.splice(i, 1);
	};

	$scope.applyFilter = function() {
		// initialise the map with results

		$scope.filter.filterResult = [];
		$scope.filter.filterOn = true; // flag to indicate that filtering should be applied when drawing
		for (var i = 0; i < $scope.filter.currentFilterCriteria.length; i++) {
			var currFilter = $scope.filter.currentFilterCriteria[i];
			if (currFilter.id.id === 1) { // searching on title
				$scope.filter.filterResult = titleWithMapFilter($scope.flatNodesForSelectedFile, currFilter.text);
			}
		}
		// redraw after filtering
		$scope.draw();
	};

	$scope.buildReferencesToNodesPerLevel = function() {
		$scope.referencesPerLevel = [];
		$scope.recurseNodes($scope.file, 0);
	};

	$scope.recurseNodes = function(nodes, level) {
		nodes.forEach(function(node) {
			if (node.children.length > 0) {
				$scope.recurseNodes(node.children, level + 1);
			}
			if ($scope.referencesPerLevel.length === 0 || typeof $scope.referencesPerLevel[level] === 'undefined') {
				for (var i = 0; i <= level; i++) {
					if (typeof $scope.referencesPerLevel[i] === 'undefined') {
						$scope.referencesPerLevel[i] = [];
					}
				}
			}
			$scope.referencesPerLevel[level].push(node);

		});
	};


	$scope.remove = function(scope) {
		scope.remove();
	};

	$scope.applyFormattingToSibilings = function(currentNode, field, sameParentOnly) {

		var getter = $parse('formatting.' + field);
		var setter = getter.assign;
		var valueToApply = getter(currentNode);

		if (!sameParentOnly) {
			$scope.buildReferencesToNodesPerLevel();
			var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];
			for (var i = 0; i < nodesAtTheSameLevel.length; i++) {
				if (nodesAtTheSameLevel[i].type === 'node') {
					setter(nodesAtTheSameLevel[i], valueToApply);
				}
			}
		}
		else {
			var parent = $scope.getParent($scope.currentNode.id)
			if (parent && parent.children.length > 0) {
				for (var i = 0; i < parent.children.length; i++) {
					if (parent.children[i].type === 'node') {
						setter(parent.children[i], valueToApply);
					}
				}
			}
			else if (!parent) {
				for (var i = 0; i < $scope.file.length; i++) {
					if ($scope.file[i].type === 'node') {
						setter($scope.file[i], valueToApply);
					}
				}
			}
		}
	}

	$scope.toggle = function(scope) {
		scope.toggle();
	};

	$scope.toggleDebug = function() {
		$scope.debugOn = !$scope.debugOn;
		$scope.draw();
	};

	$scope.toggleControls = function() {
		$scope.showControls = !$scope.showControls;
	};

	$scope.getClass = function() {
		var a = 'glyphicon ' ;
		var b =  $scope.showControls ? 'glyphicon-chevron-right': 'glyphicon-chevron-down';
		var c = a + b;
		return c;
	};

	$scope.getIcon = function(icon) {
		var a = SiteParameters.theme_directory + '/images/icons/' + icon;
		return a;
	};

	$scope.toggleEditor = function(currentNode) {
		currentNode.editorEnabled = !currentNode.editorEnabled;
	}

	$scope.toggleJson = function() {
		$scope.showJson = !$scope.showJson;
	}

	$scope.toggleVisible = function() {
		$scope.currentNode.formatting.visible = !$scope.currentNode.formatting.visible;
	}

	$scope.toggleOutline = function() {
		$scope.showOutline = !$scope.showOutline;
		$scope.draw();
	}

	$scope.moveLastToTheBeginning = function() {
		var a = $scope.file.pop();
		$scope.file.splice(0, 0, a);
	};


	$scope.draw = function draw() {
		// calculate the width and height and x coordinate for all elements
		for (var i = 0; i < $scope.file.length; i++) {
			var node = $scope.file[i];
			$scope.sumWidth(i, node, node.children, $scope.file);
			$scope.sumHeight(i, node, node.children, $scope.file);
		}


		//calculate the y coordinate and render all nodes
		var offset = 0;
		var offsetTop = 0;
		var heighest = 0;
		var line = 0;
		for (var i = 0; i < $scope.file.length; i++) {
			node = $scope.file[i];
			var previousNodeIdx = i - 1;

			if ($scope.file[previousNodeIdx] && $scope.file[previousNodeIdx].type === 'formatting') {
				line++;
			}

			node.formatting.line = line;
			$scope.setTopLevelY(node, $scope.file, i, line);
			$scope.calcYChildren({
				elem: node,
				siblings: $scope.file
			});
		}

		$scope.render();
	};

	$scope.touchstart = function(thresholdValue) {
		$scope.dragstart(thresholdValue);
	};

	$scope.dragstart = function(thresholdValue) {
		//d3.event.sourceEvent.stopPropagation();
		var a = d3.select(this);

		console.log('starting - this: %o , d3.select(this): %o, thresholdValue: %o', this, a, thresholdValue);


		$scope.dragdrophelper.initial = {
			mousex: d3.mouse(this)[0],
			mousey: d3.mouse(this)[1],
			x: parseInt(d3.transform(a.attr("transform")).translate[0]),
			y: parseInt(d3.transform(a.attr("transform")).translate[1]),
			width: parseInt(a[0][0].children[0].width.baseVal.value),
			height: parseInt(a[0][0].children[0].height.baseVal.value)
		};

		$scope.dragdrophelper.threshold.min = {
			x: $scope.dragdrophelper.initial.mousex - thresholdValue,
			y: $scope.dragdrophelper.initial.mousey - thresholdValue
		};
		$scope.dragdrophelper.threshold.max = {
			x: $scope.dragdrophelper.initial.mousex + thresholdValue,
			y: $scope.dragdrophelper.initial.mousey + thresholdValue
		};
		$scope.dragdrophelper.threshold.isNeeded = true;

		var currentPosition = {
			x: d3.mouse(this)[0],
			y: d3.mouse(this)[1]
		};

		console.log("current: %o, initial: %o, threshold: %o", currentPosition, $scope.dragdrophelper.initial, $scope.dragdrophelper.threshold);

    // $scope.doneEditing = function (elem) {
    //     if (! angular.element(elem.srcElement).hasClass('editable')) {
    //         angular.forEach($scope.todos, function (key, value) {
    //           key.editing = false;
    //         });
    //     }
    // };

		// flag to avoid redrawing while dragging is in progress
		//$scope.draggingInProgress = true;
		//d.formatting.originalx = d.formatting.x;
		//d.formatting.originaly = d.formatting.y;
		// initialise the holder of overlapping objects
		$scope.holder = [];
	}

	/**
	 * Find and remove the object being dragged from its current location in the tree.
	 * To do that, locate the parent of the object and remove it from its children array
	 */
	$scope.removeDraggedObjectFromCurrentLocation = function(d) {
		var parent = $scope.flatIndexedNodesForSelectedFile[d.id].parent;
		if (parent) {
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i].id === d.id) { // we found the object being dragged
					parent.children.splice(i, 1); // remove the node from the parent array
					break;
				}
			}
		}
		else { // no parent. Must be a top level node
			for (var i = 0; i < $scope.file.length; i++) {
				if ($scope.file[i].id === d.id) { // we found the object being dragged in the tree array
					$scope.file.splice(i, 1); // remove the node from the tree (top level)
					break;
				}
			}
		}
	}

	$scope.adjustLevel = function(arr, parentLevel) {
		for (var i = 0; i < arr.length; i++) {
			arr[i].formatting.level = parentLevel + 1;
			$scope.adjustLevel(arr[i].children, arr[i].formatting.level);
		}
	};

	$scope.moveDraggedObjectNextToOverlapingNode = function(d, overlapingNode) {
		// Find parent of overlping node
		var parent = $scope.flatIndexedNodesForSelectedFile[overlapingNode.id].parent;
		// if it has a parent, find the position of the overlaping node in the children array.
		if (parent) {
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i].id === overlapingNode.id) { // we found the overlaping node
					parent.children.splice(i + 1, 0, d); // add the dragged object as a sibiling
					d.formatting.level = parent.formatting.level + 1;
					// recurse children setting correct level
					$scope.adjustLevel(d.children, d.formatting.level);
					$scope.flatIndexedNodesForSelectedFile[d.id].parent = parent;
					break;
				}
			}
			// update the parent reference in the flat node structure
			$scope.flatIndexedNodesForSelectedFile[d.id].parent = parent;
		}
		else { // it is a top level element
			for (var i = 0; i < $scope.file.length; i++) {
				if ($scope.file[i].id === overlapingNode.id) { // we found the object being dragged in the tree array
					$scope.file.splice(i + 1, 0, d); // insert the node as sibiling of the overlaping node at the top of the tree (no parent)
					d.formatting.level = 0; // set it to level zero on the tree (top)
					// recurse children setting correct level
					$scope.adjustLevel(d.children, d.formatting.level);
					$scope.flatIndexedNodesForSelectedFile[d.id].parent = undefined; // no parent for it
					break;
				}
			}
		}
		// update the node's level in the tree to be the same as the overlaping node
		d.formatting.level = overlapingNode.formatting.level;
	};

	$scope.moveDraggedObjectAsChildOfOverlapingNode = function(d, overlapingNode) {
		$scope.flatIndexedNodesForSelectedFile[overlapingNode.id].node.children.push(d);
		$scope.flatIndexedNodesForSelectedFile[d.id].parent = overlapingNode;
		d.formatting.level = overlapingNode.formatting.level + 1;
		// recurse children setting correct level
		$scope.adjustLevel(d.children, d.formatting.level);
	};

	$scope.dragend = function(d) {
		var svg = d3.select('#svg');

		// remove the circle used to highlight the dragging
		var g = svg.selectAll('g.drag').data([], function(d) {
			return d.identifier;
		}).exit().remove();

		console.log('Dragged Obj: %o Target List:  %o ', d, $scope.holder);
		// if we end the drag without overlapping with any other objects, we "cancel" the drag
		// by returning the object to its original position

		//		group.style("opacity", 0.5);

		// sort descending by level
		$scope.holder.sort(function(a, b) {
			if (a.node.formatting.level === b.node.formatting.level) {
				return 0;
			}
			else if (a.node.formatting.level > b.node.formatting.level) {
				return -1;
			}
			else {
				return 1;
			}
		});


		var dragOverlapAny = ($scope.holder.length > 0);

		if (!dragOverlapAny || ($scope.targetIsParent($scope.holder[0].node.id, d.id) && !$scope.holder[0].force)) {
			$scope.draggingInProgress = false;
			return;
		}

		$scope.removeDraggedObjectFromCurrentLocation(d);

		if (($scope.targetIsAscendent($scope.holder[0].node.id, d.id) && !$scope.holder[0].force) || d3.event.sourceEvent.shiftKey) {
			// lets move the node to be a child of the overlaping node
			$scope.moveDraggedObjectAsChildOfOverlapingNode(d, $scope.holder[0].node);
		}
		else {
			// now, lets move the node to be a sibiling of the overlaping node.
			$scope.moveDraggedObjectNextToOverlapingNode(d, $scope.holder[0].node);
		}

		$scope.draw();
		$scope.draggingInProgress = false;
	};


	$scope.dragmove = function(d) {

		var b = d3.select(this);
		var svg = d3.select('#svg');

		var currentPosition = {};

		if (d3.event.type === 'touchmove') {
			var touchCoord = d3.touches(svg.node());
			currentPosition = {
				mousex: Math.floor(Number(touchCoord[0][0])),
				mousey: Math.floor(Number(touchCoord[0][1])),
			};
		}
		else {
			touchCoord = d3.mouse(svg.node());
			currentPosition = {
				mousex: touchCoord[0],
				mousey: touchCoord[1],
			};
		}

		console.log('x compare curr %d initial %d min %d', currentPosition.mousex, $scope.dragdrophelper.initial.mousex, $scope.dragdrophelper.threshold.min.x);

		if ($scope.dragdrophelper.threshold.isNeeded) {
			if ($scope.dragdrophelper.threshold.min.x > currentPosition.mousex || $scope.dragdrophelper.threshold.min.y > currentPosition.mousey || $scope.dragdrophelper.threshold.max.x < currentPosition.mousex || $scope.dragdrophelper.threshold.max.y < currentPosition.mousey) {
				$scope.dragdrophelper.threshold.isNeeded = false;

				b.style("opacity", 0.5);
			}
			else {
				return;
			}
		}

		var g = svg.selectAll('g.drag').data([{
			identifier: -1,
			pos: [currentPosition.mousex, currentPosition.mousey]
		}], function(d) {
			return d.identifier;
		});
		g.attr('transform', function(d) {
			return 'translate(' + d.pos[0] + ', ' + d.pos[1] + ')'
		});
		g.enter().append('g').attr('class', 'drag');
		g.append('circle').attr('r', 16).style('fill', 'black')
		g.append('circle').attr('r', 15).style('fill', 'lightblue');

		//console.log(currentPosition);
		//		a.transition().delay(50).style('opacity', 1);
		//		a.style({
		//			left: (currentPosition.x - $scope.dragdrophelper.offsetCircleCentre) + "px",
		//			top: (currentPosition.y - $scope.dragdrophelper.offsetCircleCentre) + "px"
		//		});



		// initialise list of overlapping objects
		$scope.holder = [];
		$scope.findDragOver($scope.flatNodesForSelectedFile, currentPosition.mousex, currentPosition.mousey, true, $scope.holder, d);
	};

	$scope.render = function() {

		// sort the data so objects are drawn in the correct order

		var g = d3.select("#svg").selectAll("g").data($scope.flatNodesForSelectedFile.filter(function(d) {
			if ($scope.showOutline) {
				return true; // if showing outline, show everything
			}
			else {
				return d.type === 'node';
			}
		}), function(d) {
			return d.id;
		}).sort(function(a, b) {
			if (a.formatting.level === b.formatting.level) {
				return 0;
			}
			else if (a.formatting.level > b.formatting.level) {
				return 1;
			}
			else {
				return -1;
			}
		});

		var gEnter = g.enter()
			.append('g')
			.attr("id", function(d) {
				return "group_" + d.id
			})
			.attr("class", "groupclass")

		gEnter.append("rect");
		gEnter.append("text");

		g.on('click', function(d, i) {
			$scope.findNode(d.id, true);
		});

		g.transition().duration(1000).attr("transform", function(d) {
			return "translate(" + [d.formatting.x, d.formatting.y] + ")";
		})



		g.selectAll("rect")
			.attr("id", function(d) {
				return 'rect_' + d.id
			})
			.attr("height", function(d, i) {
				return d.formatting.height;
			})
			.attr("width", function(d, i) {
				return d.formatting.width;
			})
			.style("fill", function(d, i) {
				return d.formatting.fill;
			})
			.style("fill-opacity", function(d, i) {
				if (!d.formatting.visible) {
					return 0;
				}
				if (d.type === 'node' && $scope.filter.filterOn) {
					if ($scope.filter.filterResult[d.id]) {
						return d.formatting.fillOpacity;
					}
					else {
						return 0.3;
					}
				}
				else {
					return d.formatting.fillOpacity;
				}
			})
			.style("stroke-width", function(d, i) {
				return d.formatting.nodeselected ? 3 : $scope.showOutline ? 1 : d.formatting.visible ? d.formatting.strokeWidth : 0;
			})
			.style("stroke", function(d, i) {
				return d.formatting.nodeselected ? 'pink' : $scope.showOutline ? 'black' : d.formatting.borderColor;
			})
			.style("class", ".rectlvl");

		g.selectAll("text").attr("id", function(d) {
				return 'text_' + d.id
			})
			.text(function(d) {
				if ((d.type === 'node' && d.formatting.visible) || $scope.debugOn) {
					if ($scope.debugOn) {
						return ' (line:' + d.formatting.line + ')';
					}
					return d.title;
				}
				else {
					return '';
				}
			})
			.attr("x", function(d) {
				if (d.type !== 'formatting') {
					return (d.formatting.width / 2);
				}
				else {
					return 0;
				}
			})
			.attr("y", function(d) {
				if (d.type !== 'formatting') {
					if (d.children.length > 0) {
						return $scope.textPadding
					}
					else {
						return (d.formatting.height / 2);
					}
				}
				else {
					return 0;
				}
			})
			.attr("fill", function(d) {
				return d.formatting.fontColor;
			})
			// .attr("stroke", function(d) {
			// 	return d.formatting.textBorderColor;
			// })
			.style("stroke-width", function(d, i) {
				return 0;
			})
			.attr("font-family", function(d) {
				return d.formatting.fontFamily;
			})
			.attr("font-size", function(d) {
				return d.formatting.fontSize;
			})
			.attr("text-anchor", "middle");
		g.call($scope.dragGroup);

		g.exit().remove();
	};

	// loops through array getting the height of the tallest element
	$scope.getHighestHeight = function(data, line, from, to) {
		var highest = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].formatting.line === line && data[i].formatting.height > highest)
				highest = data[i].formatting.height;
		}
		return highest;
	}

	$scope.setTopLevelY = function(elem, siblings, elemIndex, line) {
		if (elemIndex == 0 || siblings[elemIndex - 1].type !== 'formatting') {
			if (elemIndex == 0) {
				elem.formatting.y = 0;
			}
			else {
				// element will have the same y as its sibiling
				elem.formatting.y = siblings[elemIndex - 1].formatting.y;
			}
		}
		else {
			// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling
			// + the height defined for the line break itself
			var lineBreakHeight = siblings[elemIndex - 1].formatting.height;
			var yOfPreviousLine = 0;

			if (line > 0) {
				// if the line break is the very first node, it does not have sibilings 2 positions before
				if (siblings[elemIndex - 2]) {
					yOfPreviousLine = siblings[elemIndex - 2].formatting.y;
				}
				else {
					yOfPreviousLine = 0;
				}
			}

			var heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, line - 1, 0, (elemIndex - 2));
			elem.formatting.y = lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
		}
	};

	$scope.calcYChildren = function(renderObj) {

		// debug
		//alert('Line:' + i + ' X:' + elem.formatting.x + ' | Y:' + elem.formatting.y + ' ' + elem.title );
		var line = 0;

		for (var elemIndex = 0; elemIndex < renderObj.elem.children.length; elemIndex++) {
			var child = renderObj.elem.children[elemIndex];
			var siblings = renderObj.elem.children;
			var previousChildIdx = elemIndex - 1;


			if (siblings[previousChildIdx] && siblings[previousChildIdx].type === 'formatting') {
				line++;
			}

			child.formatting.line = line;
			if (elemIndex == 0 || siblings[elemIndex - 1].type != 'formatting') {
				if (elemIndex == 0) {
					child.formatting.y = renderObj.elem.formatting.y + $scope.topPadding;
				}
				else {
					child.formatting.y = siblings[elemIndex - 1].formatting.y;
				}
			}
			else {
				// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling
				// Note that the height of the sibiling already takes into account the height of the line break. 
				var yOfPreviousLine = 0;

				if (line > 0) {
					yOfPreviousLine = siblings[elemIndex - 1].formatting.y;
				}

				var heightOfHeighestSiblingOfPreviousLine = $scope.getParent(child.id).formatting.heightPerLine[line - 1].height;
				child.formatting.y = yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
			}
			//--------------------------------------------------------------------------------

			$scope.calcYChildren({
				elem: child,
				siblings: child.children
			});
		}
	};

	$scope.sumWidth = function sumWidth(elemIdx, elem, children, elemPeers) {

		var widthPerLine = [0];
		var idx = 0;
		var parent = $scope.getParent(elem.id);

		// set the x of the element to the right of the previous element or zero if brand new line
		var previousElementIdx = elemIdx - 1;
		if (elemIdx >= 1) {
			if (elemPeers[previousElementIdx].type != 'formatting') {
				elem.formatting.x = elemPeers[previousElementIdx].formatting.x + elemPeers[previousElementIdx].formatting.width + $scope.padding;
			}
			else if (parent) {
				elem.formatting.x = parent.formatting.x + $scope.padding;
			}
			else {
				elem.formatting.x = 0;
			}

		}
		else if (parent) {
			elem.formatting.x = parent.formatting.x + $scope.padding;
		}
		else {
			elem.formatting.x = 0;
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var previousChildIdx = i - 1;

			if (children[previousChildIdx] && children[previousChildIdx].type === 'formatting') {
				widthPerLine.push(0);
				idx++;
			}

			// initialize the x of the child element a bit to the right of the border of the elem.
			// This will change further down if the element has sibillings.
			child.formatting.x = elem.formatting.x + $scope.padding;

			// if the element has sibilling, offset the x taking into account the x of the sibilling
			if (previousChildIdx >= 0) {
				if (children[previousChildIdx].type != 'formatting') {
					child.formatting.x = children[previousChildIdx].formatting.x + children[previousChildIdx].formatting.width + $scope.padding;
				}
			}

			if (child.children.length > 0) {
				$scope.sumWidth(i, child, child.children, children);
			}
			if (!child.formatting.width || child.formatting.width < $scope.minWidth) {
				child.formatting.width = $scope.defaultWidth;
			}

			// save width for the current line
			widthPerLine[idx] = widthPerLine[idx] + child.formatting.width + $scope.padding;
		};

		// Sort the line widths so we can get the heighest number. The width of the elem must be  
		// at least the width of the longest line of its children (assuming page breaks)
		widthPerLine.sort(function(a, b) {
			return a - b
		});

		var minWidthCalc = widthPerLine[widthPerLine.length - 1] + ($scope.padding);
		if (!elem.formatting.width || elem.formatting.width < minWidthCalc) {
			elem.formatting.width = minWidthCalc;
		}

		if (elem.formatting.width < $scope.minWidth) {
			elem.formatting.width = $scope.minWidth;
		}
	};

	$scope.sumHeight = function sumHeight(elemIdx, elem, children, elemPeers) {
		var heightPerLine = [0];
		var idx = 0;
		elem.formatting.y = 0;

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var previousChildIdx = i - 1;
			var lineBreakHeight = 0;

			if (children[previousChildIdx] && children[previousChildIdx].type === 'formatting') {
				// we had a line break. Lets add the line break height to the total height of
				// the previous line
				lineBreakHeight = children[previousChildIdx].formatting.height;
				heightPerLine[idx] = heightPerLine[idx] + lineBreakHeight;
				heightPerLine.push(0);
				// increment to start new line
				idx++;
			}

			// initialize the y of the child element to the bottom of the top border of the elem.
			// This will change further down if there are line breaks as sibilling elements.
			child.formatting.y = elem.formatting.y + $scope.topPadding;

			if (child.children.length > 0) {
				$scope.sumHeight(i, child, child.children, children);
			}
			if (child.formatting.height < $scope.minHeight) {
				child.formatting.height = $scope.defaultHeight;
			}

			// save height for the current line
			if (child.formatting.height > heightPerLine[idx]) {
				heightPerLine[idx] = child.formatting.height; //+ $scope.padding;
			}
		};

		// store the number of lines in the elem for helping with rendering later.
		if (elem.type !== 'formatting') {
			elem.formatting.numLines = idx + 1;
		}
		// sum the height of each line for the children
		var totalHeight = 0;
		elem.formatting.heightPerLine = [];
		for (var i = 0, len = elem.formatting.numLines; i < len; i++) {
			totalHeight += heightPerLine[i];
			elem.formatting.heightPerLine[i] = {
				"line": i,
				"height": heightPerLine[i]
			};
		}

		var elemExpectedMinHeight = 0;
		// if the element has children, its minimum height must be the height of each of the lines
		// for the children combined plus some padding

		if (elem.children.length > 0) {
			elemExpectedMinHeight = (totalHeight + $scope.padding + $scope.topPadding);
		}

		// set minimum height if the object is shorter than minimum
		// otherwise do nothing as the user may have set the hight
		if (elem.formatting.height < elemExpectedMinHeight) {
			elem.formatting.height = elemExpectedMinHeight;
		}

		if (elem.formatting.height < $scope.minHeight) {
			if (children.length > 0) {
				elem.formatting.height = $scope.minHeight + $scope.padding * 2;
			}
			else {
				elem.formatting.height = $scope.minHeight;
			}
		}
	};

	$scope.print = function print(data, level) {
		level++;
		data.forEach(function(elem) {
			console.log(level + ' ' + elem.title + ' ' + elem.formatting.width + ' height: ' + elem.formatting.height);
			$scope.print(elem.children, level);
		});
	};


	$scope.$watch("file", function(newValue, oldValue) {
		if (!$scope.draggingInProgress) {
			$scope.draw();
		}
	}, true);

	$scope.applyChanges = function() {
		$scope.draw();
	}

	$scope.makeTaller = function() {
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height + 20;
	}

	$scope.makeShorter = function() {
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height - 20;
	}

	$scope.applyHeightToSibilings = function() {
		var parent = $scope.getParent($scope.currentNode.id)
		if (parent && parent.children.length > 0) {
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i].type === 'node') {
					parent.children[i].formatting.height = $scope.currentNode.formatting.height;
				}
			}
		}
	}

	$scope.applyWidthToSibilings = function() {
		var parent = $scope.getParent($scope.currentNode.id)
		if (parent && parent.children.length > 0) {
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i].type === 'node') {
					parent.children[i].formatting.width = $scope.currentNode.formatting.width;
				}
			}
		}
	}

	$scope.makeLessLong = function() {
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width - 20;
	}

	$scope.makeLonger = function() {
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width + 20;
	}

	$scope.increaseFontSize = function() {
		$scope.currentNode.formatting.fontSize = $scope.currentNode.formatting.fontSize + 1;
	}

	$scope.decreaseFontSize = function() {
		$scope.currentNode.formatting.fontSize = $scope.currentNode.formatting.fontSize - 1;
	}
	$scope.makeStrokeThicker = function() {
		$scope.currentNode.formatting.strokeWidth = $scope.currentNode.formatting.strokeWidth + 1;
	}
	$scope.makeStrokeThinner = function() {
		$scope.currentNode.formatting.strokeWidth = $scope.currentNode.formatting.strokeWidth - 1;
	}

	$scope.isOverlaping = function(mousex, mousey, target, objBeingDragged) {
		var t_x = Number(target.formatting.x);
		var t_y = Number(target.formatting.y);
		var t_w = Number(target.formatting.width);
		var t_h = Number(target.formatting.height);

		if (mousex >= t_x && mousex <= (t_x + t_w) && mousey >= t_y && mousey <= (t_y + t_h)) {
			return true;
		}
		return false;
	}

	$scope.isOverlapingOnTheRight = function(mousex, mousey, target, objBeingDragged) {
		var t_x = Number(target.formatting.x);
		var t_y = Number(target.formatting.y);
		var t_w = Number(target.formatting.width);
		var t_h = Number(target.formatting.height);
		var drag_y = Number(objBeingDragged.formatting.y);
		var drag_h = Number(objBeingDragged.formatting.height);
		if (target.title === 'node2.2.6') {
			console.log(mousex, mousey, t_x, t_y, t_w, t_h, drag_y, drag_h);

		}
		if (mousex >= t_x && mousex <= (t_x + t_w)) {
			if (mousey >= t_y && mousey <= (t_y + t_h)) {
				return true;
			}
			else if ((mousey + drag_h) > t_y && drag_y < (t_y + t_h)) {
				return true;
			}
		}
		return false;
	}

	$scope.isOverlapingOnTheLeft = function(mousex, mousey, target, objBeingDragged) {
		var t_x = Number(target.formatting.x);
		var t_y = Number(target.formatting.y);
		var t_w = Number(target.formatting.width);
		var t_h = Number(target.formatting.height);
		var drag_y = Number(objBeingDragged.formatting.y);
		var drag_h = Number(objBeingDragged.formatting.height);
		var drag_w = Number(objBeingDragged.formatting.width);

		if (mousex + drag_w >= t_x && mousex <= (t_x)) {
			if (mousey >= t_y && mousey <= (t_y + t_h)) {
				return true;
			}
			else if ((mousey + drag_h) > t_y && drag_y < (t_y + t_h)) {
				return true;
			}
		}
		return false;
	}

	$scope.onlyOverlapsParent = function(objectBeingDragged, listOfOverlapingObjects) {

		var rc = false;
		for (var i = 0; i < listOfOverlapingObjects.length; i++) {
			if ($scope.targetIsParent(listOfOverlapingObjects[i].id, objectBeingDragged.id)) {
				rc = true;
			}
			else {
				return false;
			}
		}

		return rc;
	}

	$scope.targetIsAscendent = function(targetId, nodeId) {
		if ($scope.flatIndexedNodesForSelectedFile[nodeId].parent === undefined) {
			return false;
		}

		if ((targetId === $scope.flatIndexedNodesForSelectedFile[nodeId].parent.id)) {
			return true;
		}
		else {
			return $scope.targetIsAscendent(targetId, $scope.flatIndexedNodesForSelectedFile[nodeId].parent.id)
		}
	}

	$scope.targetIsParent = function(targetId, objBeingDraggedId) {
		if ($scope.flatIndexedNodesForSelectedFile[objBeingDraggedId].parent === undefined) {
			return false;
		}

		return (targetId === $scope.flatIndexedNodesForSelectedFile[objBeingDraggedId].parent.id);
	}

	$scope.targetIsChild = function(targetId, draggedObjChildren) {
		for (var i = 0; i < draggedObjChildren.length; i++) {
			if (draggedObjChildren[i].id === targetId) {
				return true;
			}
			else if ($scope.targetIsChild(targetId, draggedObjChildren[i].children)) {
				return true;
			}
		}
		return false;
	}

	$scope.findDragOver = function(objArr, mousex, mousey, highlight, holder, objBeingDragged) {
		for (var i = 0; i < objArr.length; i++) {
			var target = objArr[i];

			if (target.type === 'node' && target.id !== objBeingDragged.id && !$scope.targetIsChild(target.id, objBeingDragged.children)) {
				var overlaping = $scope.isOverlaping(mousex, mousey, target, objBeingDragged);
				var group = d3.select("#group_" + target.id);
				console.log(overlaping);
				//var overlapingWithShiftKey = isOverlapingWithShiftKey(mousex, mousey, obj)
				if (overlaping) {
					// Yes, the mouse is over another rectangle. 
					holder.push({
						node: target,
						force: false
					});
					console.log('found ' + target.title);

					if (highlight) {
						// lets highligth it
						var classx = overlaping ? "somethingontheright" : "somethingontheleft";
						group.classed(classx, true);
						group.classed("groupclass", false);
						group.style("stroke-width", 2)
							.style("stroke", "pink");
					}
				}
				else {
					// Nope, we did not hit any objects yet
					if (highlight) {
						// remove highlighting
						group.style("stroke-width", function(d, i) {
								return target.formatting.strokeWidth;
							})
							.style("stroke", function(d, i) {
								return target.formatting.borderColor;
							});

						group.classed("somethingontheright", false);
						group.classed("somethingontheleft", false);
						group.classed("groupclass", true);
					}
				}
			}
		}

		// there is a scenario where a child object is dragged outside of its parent
		// without touching any other objects. In this case, we move the object
		// to the top of the tree. The target is set as the last node in the top
		// level of the tree so this one is moved next to it at the top
		if ((!overlaping) && holder.length == 0 && objBeingDragged.formatting.level > 0) {
			var parent = $scope.flatIndexedNodesForSelectedFile[objBeingDragged.id].parent;

			var overlapParent = $scope.isOverlaping(mousex, mousey, parent, objBeingDragged);
			if (!overlapParent) {
				holder.push({
					node: $scope.file[$scope.file.length - 1],
					force: true
				});
			}
		}

	}


	$scope.shadeBlend = function(p, c0, c1) {
		var n = p < 0 ? p * -1 : p,
			u = Math.round,
			w = parseInt;
		if (c0.length > 7) {
			var f = c0.split(","),
				t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),
				R = w(f[0].slice(4)),
				G = w(f[1]),
				B = w(f[2]);
			return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
		}
		else {
			var f = w(c0.slice(1), 16),
				t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16),
				R1 = f >> 16,
				G1 = f >> 8 & 0x00FF,
				B1 = f & 0x0000FF;
			return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
		}
	};

	$scope.dragGroup = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", function() {
			$scope.dragstart.bind(this, 5)();
		})
		.on("dragend", $scope.dragend)
		.on("drag", $scope.dragmove);

	// d3.select("#canvasDiv")
	//   .on("touchstart", function() {
	//   	$scope.dragstart.bind(this, 5)();
	//   })
	//   .on("touchmove", $scope.dragmove)
	//   .on("touchend", $scope.dragend);


}]);
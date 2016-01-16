/* global app*/
/* global SiteParameters*/
/* global d3 */

app.controller('diagramCtrl', ['$scope', '$parse', '$stateParams', '$mdSidenav', '$log', 't9Service', 'titleWithMapFilter', 'attributeNameFilter', 'attributeValueFilter', function($scope, $parse, $stateParams, $mdSidenav, $log, t9Service, titleWithMapFilter, attributeNameFilter, attributeValueFilter) {

	$scope.groups = new Array();
	$scope.tops = 0;
	$scope.showTextSetter = false;
	$scope.minWidth = 1;
	$scope.minHeight = 1;
	$scope.defaultWidth = 50;
	$scope.defaultHeight = 50;
	$scope.textPadding = 20;
	$scope.padding = 10;
	$scope.topPadding = 30;
	$scope.editorEnabled = false;
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
	$scope.file = $scope.currentFile.nodes;
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
	
	$scope.panMode = true;
	$scope.scaleMultiplier = 1;
	$scope.margin = {
		    "top": 10,
		    "right": 10,
		    "bottom": 10,
		    "left": 10
	};
	
	$scope.initSVG = function() {
		$scope.svgWidth = $scope.currentFile.svg_width;
		$scope.svgHeight = $scope.currentFile.svg_height;
		
		$scope.width = $scope.svgWidth - $scope.margin.left - $scope.margin.right,
		$scope.height = $scope.svgHeight - $scope.margin.top - $scope.margin.bottom;
	
		$scope.svgViewport = d3.select("#svg")
		  	.attr("width", $scope.width + $scope.margin.left + $scope.margin.right)
		  	.attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom)
		  	.style("border", "2px ");
		// Scales
		$scope.xAxisScale = d3.scale.linear()
		  .domain([0, $scope.width])
		  .range([0, $scope.width]);
		
		$scope.yAxisScale = d3.scale.linear()
		  .domain([0, $scope.height])
		  .range([0, $scope.height]);
		
		// Axis Functions
		$scope.xAxis = d3.svg.axis()
		  .scale($scope.xAxisScale)
		  .orient("top")
		  .tickSize(-$scope.height);
		
		$scope.yAxis = d3.svg.axis()
		  .scale($scope.yAxisScale)
		  .orient("left")
		  .tickSize(-$scope.width);

		$scope.innerSpace = $scope.svgViewport.selectAll(".inner_space").data([$scope.margin])
			.attr("class", "inner_space")
			.attr("transform", function(d) { return "translate(" + d.left + "," + d.top + ")" });

//		$scope.innerSpace.selectAll("#overlay").attr("width", $scope.width).attr("height", $scope.height);		;
		var gEnter = $scope.innerSpace.enter().append("g")
			.attr("class", "inner_space")
			.attr("transform", function(d) { 
				return "translate(" + d.left + "," + d.top + ")" 
			})
		gEnter.append("rect").attr("id", "overlay");

		gEnter.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0,0)");
		
		gEnter.append("g")
		  .attr("class", "y axis");

		$scope.innerSpace.selectAll("#overlay").attr("width", $scope.width).attr("height", $scope.height);		
		$scope.innerSpace.select(".x.axis").call($scope.xAxis);
		$scope.innerSpace.select(".y.axis").call($scope.yAxis);

	}
	
	// initialise the SVG
	$scope.initSVG();
	// Inner Drawing Space
	// $scope.innerSpace = $scope.svgViewport.append("g")
	//   .attr("class", "inner_space")
	//   .attr("transform", "translate(" + $scope.margin.left + "," + $scope.margin.top + ")");

	// $scope.innerSpace.append("rect").attr("id", "overlay").attr("width", $scope.width).attr("height", $scope.height);
	
	// Draw Axis
	  	
	$scope.gDrawingContainer = $scope.innerSpace.append("g");
	
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
			// initialize the array as it starts being populated from the highest level (index)
			// eg, if there are 5 levels in the structure, index 4 will be the first one to be populated with references.
			// Subsequently, the shallower levels get populated.
			// In other words, bottom up
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

	$scope.applyFormattingToSibilingsOld = function(currentNode, field, sameParentOnly) {

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

	$scope.applyFormattingToSibilings = function(currentNode, field, sameParentOnly) {

		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("apply formatting to sibilings");

		if (!sameParentOnly) {
			$scope.buildReferencesToNodesPerLevel();
			var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];
			for (var i = 0; i < nodesAtTheSameLevel.length; i++) {
				if (nodesAtTheSameLevel[i].type === 'node') {
					nodesAtTheSameLevel[i].formatting[field] = currentNode.formatting[field];
				}
			}
		} else {
			var parent = $scope.getParent($scope.currentNode.id)
			var siblings = $scope.file;

			if (parent && parent.children.length > 0) {
				siblings = parent.children;
			} 

			for (var i = 0; i < siblings.length; i++) {
				if (siblings[i].type === 'node') {
					siblings[i].formatting[field] = $scope.currentNode.formatting[field];
				}
			}
		}
		$scope.draw();
	}

	$scope.toggle = function(scope) {
		scope.toggle();
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

	
	$scope.configurePanAndDragBehaviour = function() {
		var g = $scope.gDrawingContainer.selectAll("g");
		if ($scope.panMode) {
//			g.call($scope.zoomBehaviour);
			$scope.innerSpace.call($scope.zoomBehaviour);
			g.call($scope.noDragBehaviour);
		} else {
			g.call($scope.dragGroup);
			$scope.innerSpace.call($scope.noZoomBehaviour);
		}
	};
	
	$scope.togglePanAndDrag = function() {
		$scope.panMode = !$scope.panMode;
		$scope.configurePanAndDragBehaviour();
	};

	$scope.toggleVisible = function() {
		$scope.currentNode.formatting.visible = !$scope.currentNode.formatting.visible;
	}

	$scope.moveLastToTheBeginning = function() {
		var a = $scope.file.pop();
		$scope.file.splice(0, 0, a);
	};

	$scope.doubleclick = function(d, i) {
		var originalText = d.title;
		var textSetterDiv = d3.select("#textSetter");
		textSetterDiv.on("keydown", function() {
			if (d3.event.keyCode === 13) {
				d3.event.stopPropagation();
				//alert(d3.event.keyCode + d.title);
				// insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
				//document.execCommand('insertHTML', false, '<br>');
				$scope.currentNode.title = textSetterDiv.html();
				// prevent the default behaviour of return key pressed
				d3.event.preventDefault();
				$scope.showTextSetter = false;
				$scope.$apply();
			} else if (d3.event.keyCode === 27) { // escape
				$scope.currentNode.title = originalText;
				$scope.showTextSetter = false;
				$scope.$apply();
			} else {
				$scope.currentNode.title = textSetterDiv.html();
			}
		})

		var xx = d3.event.x;
		var yy = d3.event.y;
		
		textSetterDiv.style({   left: xx + "px",
					top: yy + "px"
		});
		textSetterDiv.html(d.title);
		$scope.showTextSetter = true;
		
			// mousex: d3.mouse(this)[0],
			// mousey: d3.mouse(this)[1],
			// x: parseInt(d3.transform(a.attr("transform")).translate[0]),
			// y: parseInt(d3.transform(a.attr("transform")).translate[1]),
			// width: parseInt(a[0][0].children[0].width.baseVal.value),
			// height: parseInt(a[0][0].children[0].height.baseVal.value)
	};

	$scope.calculateWidthHeightAndX = function() {
		for (var i = 0; i < $scope.file.length; i++) {
			var node = $scope.file[i];
			$scope.sumWidth(i, node, node.children, $scope.file);
			$scope.sumHeight(i, node, node.children, $scope.file);
		}
	};

	$scope.calculateY = function() {
		//calculate the y coordinate and render all nodes
		var node = {};
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
	};
	
	$scope.draw = function() {
		$scope.calculateWidthHeightAndX();
		$scope.calculateY();
		$scope.render();
	};

	// listen to broadcasts requesting a for a redraw to accur. These come from the MainCtrl
	// when setting debug on, etc.
	
	$scope.$on('redraw', function() {
		$scope.draw();        
	});
	
	$scope.$on('undo', function() {
		$scope.file = $scope.currentFile.nodes;
		$scope.gDrawingContainer.selectAll("*").remove();
		$scope.draw();        
	});
	
	$scope.$on('fileNew', function() {
		$scope.gDrawingContainer.selectAll("*").remove();
		$scope.draw();        
	});
	
	$scope.$on('fileClose', function() {
		$scope.gDrawingContainer.selectAll("*").remove();
		$scope.draw();        
	});
	

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
			// find the object in the array of children
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
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("drag & drop");

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
				console.log("opacity to 0.5");
				//b.style("opacity", 0.5);
			} else {
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

		// initialise list of overlapping objects
		$scope.holder = [];
		$scope.findDragOver($scope.flatNodesForSelectedFile, currentPosition.mousex, currentPosition.mousey, true, $scope.holder, d);
	};

	$scope.zoomFunction = function() {
	
	  // Select All Circles
	  var gContainers = $scope.innerSpace.selectAll(".groupclass");

	  // Scaling Multiplier
	  $scope.scaleMultiplier = d3.event.scale;
	
	  // Redraw the Axis
	  $scope.innerSpace.select(".x.axis").call($scope.xAxis);
	  $scope.innerSpace.select(".y.axis").call($scope.yAxis);
	
	  // Redraw the rest
	  gContainers.attr("transform", function(d) {
	    return "translate(" + [$scope.xAxisScale(d.formatting.x), $scope.yAxisScale(d.formatting.y)] + ")"
	    + " scale(" + $scope.scaleMultiplier + ")";
	  });
	
	}

	$scope.coordinates = function(point) {
	  var scale = $scope.zoomBehaviour.scale(), translate = $scope.zoomBehaviour.translate();
	  return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
	}
	
	$scope.point = function(coordinates) {
	  var scale = $scope.zoomBehaviour.scale(), translate = $scope.zoomBehaviour.translate();
	  return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
	}

	$scope.z = function(direction) {
  		$scope.innerSpace.call($scope.zoomBehaviour.event); // https://github.com/mbostock/d3/issues/2387

		// Record the coordinates (in data space) of the center (in screen space).
		var center0 = $scope.zoomBehaviour.center();
		var translate0 = $scope.zoomBehaviour.translate();
		var coordinates0 = $scope.coordinates(center0);

		if (direction === 1) {
			$scope.zoomBehaviour.scale($scope.zoomBehaviour.scale() * 1.2);
		} else {
		  $scope.zoomBehaviour.scale($scope.zoomBehaviour.scale() * 0.8);
		}
		
		// Translate back to the center.
		var center1 = $scope.point(coordinates0);
		$scope.zoomBehaviour.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);
		
		$scope.innerSpace.call($scope.zoomBehaviour.event);
	}
	

	$scope.zReset = function() {
  		$scope.innerSpace.call($scope.zoomBehaviour.event); // https://github.com/mbostock/d3/issues/2387

		// when reseting the zoom and pan to zero,zero coordinates.
		
		// fist, reset the scale of the zoom to 1
		$scope.zoomBehaviour.scale(1);
		
		// // second, reset the x and y to the coordinates of the xAxisScale, which goes from 0 to the defined width
		// // same for the y
		// $scope.zoomBehaviour.x($scope.xAxisScale.domain([0, $scope.width]));
		// $scope.zoomBehaviour.y($scope.yAxisScale.domain([0, $scope.height]));

		// // call the zoom behaviour to apply the changes		
		// $scope.innerSpace.call($scope.zoomBehaviour.event);

		// this is to reset the zoom scale and pan coordinates to 0,0 using a transition. To do that, apparently we need 
		// this tween function. Need to look it up a bit more.
		d3.transition().duration(750).tween("zoom", function() {
		    var ix = d3.interpolate($scope.xAxisScale.domain(), [0, $scope.width]),
        		iy = d3.interpolate($scope.yAxisScale.domain(), [0, $scope.height]);
		    return function(t) {
				$scope.zoomBehaviour.x($scope.xAxisScale.domain(ix(t))).y($scope.yAxisScale.domain(iy(t)));
				// Redraw the Axis
				$scope.innerSpace.select(".x.axis").call($scope.xAxis);
				$scope.innerSpace.select(".y.axis").call($scope.yAxis);
				// this will get the other objects to resize to defined scale
				$scope.innerSpace.call($scope.zoomBehaviour.event);
		    };
		  });


	}
	
	$scope.render = function() {
		// sort the data so objects are drawn in the correct order

		var g = $scope.gDrawingContainer.selectAll("g").data($scope.flatNodesForSelectedFile.filter(function(d) {
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
			.attr("class", "groupclass");


		gEnter.append("rect");
		gEnter.append("text");

		g.on('click', function(d, i) {
			$scope.findNode(d.id, true);
			// make sure the div for setting text is made invisible
			$scope.showTextSetter = false;
		});
		g.on("dblclick",function(d, i){ 
			$scope.doubleclick(d, i);
		});
		g.transition().duration(1000).attr("transform", function(d) {
	    		return "translate(" + [$scope.xAxisScale(d.formatting.x), $scope.yAxisScale(d.formatting.y)] + ")"
			         + " scale(" + $scope.scaleMultiplier + ")";
		})



		g.selectAll("rect")
			.attr("class", "drawing-rect")
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
//						return ' (line:' + d.formatting.line + ')';
						return ' (width:' + d.formatting.width + ')';
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
//				return d.formatting.fontSize;
				return "10px";
			})
			.attr("text-anchor", "middle");
//		g.call($scope.dragGroup);

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
				if (siblings[elemIndex - 1]) {
					yOfPreviousLine = siblings[elemIndex - 1].formatting.y;
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


	// this function operates on the currently selected node
	$scope.snugIt = function() {
		// if we don't have a selected note, nothing to do
		if (!$scope.currentNode) {
			return;
		}
		// if the selected node has no children, nothing to do
		if (!$scope.currentNode.children || $scope.currentNode.children.length === 0) {
			return;
		}
		
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("snug it");

		// make the width of the current node snuggle to its children
		var idxOfLastChild = $scope.currentNode.children.length - 1;
		var xOfLastChild = $scope.currentNode.children[idxOfLastChild].formatting.x;
		var widthOfLastChild = $scope.currentNode.children[idxOfLastChild].formatting.width;
		$scope.currentNode.formatting.width = xOfLastChild + widthOfLastChild + $scope.padding - $scope.currentNode.formatting.x;
		
		// make the height of the current node snuggle to its children
		var yOfLastChild = $scope.currentNode.children[idxOfLastChild].formatting.y;
		var heightOfLastChild = $scope.currentNode.children[idxOfLastChild].formatting.height;
		$scope.currentNode.formatting.height = yOfLastChild + heightOfLastChild + $scope.padding - $scope.currentNode.formatting.y;
		$scope.draw();
	};

	$scope.sumWidth = function(elemIdx, elem, children, elemPeers) {

		var widthPerLine = [0];
		var idx = 0;
		var parent = $scope.getParent(elem.id);

		// set the x of the element to the right of the previous element or zero if brand new line
		var previousElementIdx = elemIdx - 1;
		if (elemIdx >= 1) {
			if (elemPeers[previousElementIdx].type !== 'formatting') {
				if (elem.type !== 'formatting' || (elem.type === 'formatting' && $scope.showOutline)) {
					elem.formatting.x = elemPeers[previousElementIdx].formatting.x 
					+ elemPeers[previousElementIdx].formatting.width
					+ elemPeers[previousElementIdx].formatting.marginRight
					+ elem.formatting.marginLeft;
				} else { // this is a line break and we are not showing the outline. 
					elem.formatting.x = elem.formatting.marginLeft;
				}
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
			elem.formatting.x = elem.formatting.marginLeft;
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var previousChildIdx = i - 1;

			// this is a line break
			if (children[previousChildIdx] && children[previousChildIdx].type === 'formatting') {
				widthPerLine.push(0);
				idx++;
			}

			// initialize the x of the child element a bit to the right of the border of the elem.
			// This will change further down if the element has sibillings.
			if (child.type !== 'formatting' || (child.type === 'formatting' && $scope.showOutline)) {
				child.formatting.x = elem.formatting.x + $scope.padding;

				// if the element has sibilling, offset the x taking into account the x of the sibilling
				if (previousChildIdx >= 0) {
					if (children[previousChildIdx].type !== 'formatting') {
						child.formatting.x = children[previousChildIdx].formatting.x + children[previousChildIdx].formatting.width + $scope.padding;
					}
				}
			}

			if (child.children.length > 0) {
				$scope.sumWidth(i, child, child.children, children);
			}
			
			// Set the width of the child. If it is a linebreak, set it to zero so we don't mess up the formatting
			// Do that UNLESS it we want to show the outline, in which case, we give the linebreak a width so we can
			// se it on the screen
			if (child.type === 'formatting' && !$scope.showOutline) {
					child.formatting.width = 0;
			} else {
				if (!child.formatting.width || child.formatting.width < $scope.minWidth) {
					child.formatting.width = $scope.defaultWidth;
				}

				// save width for the current line
				widthPerLine[idx] = widthPerLine[idx] + child.formatting.width + $scope.padding;
			}
		};

		// Sort the line widths so we can get the heighest number. The width of the elem must be  
		// at least the width of the longest line of its children (assuming page breaks)
		widthPerLine.sort(function(a, b) {
			return a - b
		});

		if (elem.type === 'formatting' && !$scope.showOutline) {
			elem.formatting.width = 0;
		} else {
			var minWidthCalc = widthPerLine[widthPerLine.length - 1];
			if (!elem.formatting.width || elem.formatting.width < minWidthCalc) {
				elem.formatting.width = minWidthCalc;
			}
	
			if (elem.formatting.width < $scope.minWidth) {
				elem.formatting.width = $scope.minWidth;
			}
		}
	};

	$scope.sumHeight = function(elemIdx, elem, children, elemPeers) {
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

	$scope.print = function(data, level) {
		level++;
		data.forEach(function(elem) {
			console.log(level + ' ' + elem.title + ' ' + elem.formatting.width + ' height: ' + elem.formatting.height);
			$scope.print(elem.children, level);
		});
	};

	$scope.$watch("currentNode", function(newValue, oldValue) {
		// add to undo stack
		if (!$scope.draggingInProgress) {
			$scope.draw();
		}
	}, true);

	$scope.applyChanges = function() {
		$scope.draw();
	}

	$scope.makeTaller = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make taller");
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height + 20;
	}

	$scope.resizeSVG = function(by) {
		$scope.currentFile.svg_width = $scope.currentFile.svg_width === undefined ? +$scope.svg_width + (by) : +$scope.currentFile.svg_width + (by);
		$scope.initSVG();
		$scope.draw();
	};
	
	$scope.makeShorter = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make shorter");
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height - 20;
	};

	$scope.applyHeightToSibilings = function() {
		var parent = $scope.getParent($scope.currentNode.id)
		if (parent && parent.children.length > 0) {
			// copy nodes to undo stack before making the change
			$scope.addToUndoStack("apply height to sibilings");
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
			// copy nodes to undo stack before making the change
			$scope.addToUndoStack("apply width to sibilings");
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i].type === 'node') {
					parent.children[i].formatting.width = $scope.currentNode.formatting.width;
				}
			}
		}
	}

	$scope.makeLessLong = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make shorter");
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width - 20;
	}

	$scope.makeLonger = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make longer");
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width + 20;
	}

	$scope.increaseFontSize = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("increase font size");
		$scope.currentNode.formatting.fontSize = $scope.currentNode.formatting.fontSize + 1;
	}

	$scope.decreaseFontSize = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("decrease font size");
		$scope.currentNode.formatting.fontSize = $scope.currentNode.formatting.fontSize - 1;
	}
	$scope.makeStrokeThicker = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make stroke thicker");
		$scope.currentNode.formatting.strokeWidth = $scope.currentNode.formatting.strokeWidth + 1;
	}
	$scope.makeStrokeThinner = function() {
		// copy nodes to undo stack before making the change
		$scope.addToUndoStack("make stroke thinner");
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
				//var group = d3.select("#group_" + target.id);
				console.log(overlaping);
				//var overlapingWithShiftKey = isOverlapingWithShiftKey(mousex, mousey, obj)
				if (overlaping) {
					// Yes, the mouse is over another rectangle. 
					holder.push({
						node: target,
						force: false
					});
					console.log('found ' + target.title);
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

	$scope.noDragBehaviour = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", null)
		.on("dragend", null)
		.on("drag", null);

	$scope.zoomBehaviour = d3.behavior.zoom()
	  .x($scope.xAxisScale)
	  .y($scope.yAxisScale)
	  .center([$scope.width / 2, $scope.height / 2])
	  .scaleExtent([0.2, 10])
	  .on("zoom", $scope.zoomFunction);

	$scope.noZoomBehaviour = d3.behavior.zoom()
	  .on("zoom", null);

	// configure the default behaviour of the SVG element
	$scope.configurePanAndDragBehaviour();
}]);
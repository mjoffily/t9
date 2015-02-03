app.controller('diagramCtrl', ['$scope', '$parse', 'ngDialog', '$stateParams', 't9Service', '$filter', function($scope, $parse, ngDialog, $stateParams, t9Service, $filter) {

	$scope.groups = new Array();
	$scope.tops = 0;
	$scope.minWidth = 5;
	$scope.minHeight = 5;
	$scope.defaultWidth = 100;
	$scope.defaultHeight = 100;
	$scope.textPadding = 20;
	$scope.padding = 10;
	$scope.topPadding = 30;
	$scope.editorEnabled = false;
	$scope.showJson = false;
	$scope.propertiesTemplate = SiteParameters.theme_directory + '/js/partials/popup.html';
	$scope.shapes = ['rectangle', 'circle', 'triangle', 'elipse'];
	$scope.holder = []; // holdings list of overlapping objects during drag event
	$scope.drag = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", $scope.dragstart)
		.on("dragend", $scope.dragend)
		.on("drag", $scope.dragmove);


	$scope.referencesPerLevel = [];
	$scope.file = $scope.data[$stateParams.idx].nodes;

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

	$scope.clickToOpen = function(currentNode) {
		$scope.currentNode = currentNode.$modelValue;
		if ($scope.currentNode.type === 'formatting') {
			ngDialog.openConfirm({
				template: SiteParameters.theme_directory + '/js/partials/popup-linebreak-properties.html',
				scope: $scope,
				windowClass: 'fixed-to-the-right-modal'
			});
		}
		else {
			ngDialog.openConfirm({
				template: SiteParameters.theme_directory + '/js/partials/popup.html',
				scope: $scope,
				windowClass: 'fixed-to-the-right-modal'
			});
		}
	};


	$scope.applyFillColorToSibilings = function(currentNode) {
		$scope.buildReferencesToNodesPerLevel();
		var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];

		for (var i = 0; i < nodesAtTheSameLevel.length; i++) {
			nodesAtTheSameLevel[i].formatting.fill = currentNode.formatting.fill;
		}

	}

	$scope.applyFormattingToSibilings = function(currentNode, field) {
		$scope.buildReferencesToNodesPerLevel();
		var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];

		var sourceField = eval('currentNode.formatting.' + field);
		for (var i = 0; i < nodesAtTheSameLevel.length; i++) {
			var destinationField = $parse(field, nodesAtTheSameLevel[i].formatting);
			destinationField.assign(sourceField);
			//			$scope.$eval('nodesAtTheSameLevel[i].formatting.' + field + ' = currentNode.formatting.' + field);
		}

	}

	$scope.toggle = function(scope) {
		scope.toggle();
	};

	$scope.toggleEditor = function(currentNode) {
		currentNode.editorEnabled = !currentNode.editorEnabled;
	}

	$scope.toggleJson = function() {
		$scope.showJson = !$scope.showJson;
	}

	$scope.moveLastToTheBeginning = function() {
		var a = $scope.file.pop();
		$scope.file.splice(0, 0, a);
	};


	$scope.draw = function draw() {
		// clear the canvas
		d3.selectAll("svg > *").remove();

		// calculate the width and height and x coordinate for all elements
		for (var i = 0; i < $scope.file.length; i++) {
			var elem = $scope.file[i];
			$scope.sumWidth(i, elem, elem.children, $scope.file);
			$scope.sumHeight(i, elem, elem.children, $scope.file);
		}


		//calculate the y coordinate and render all elements
		var offset = 0;
		var offsetTop = 0;
		var heighest = 0;
		var line = 0;
		for (var i = 0; i < $scope.file.length; i++) {
			var elem = $scope.file[i];
			elem.formatting.line = line;

			// don't render or calculate y if this is a line break symbol
			if (elem.type == 'formatting') {
				line++;
				continue;
			}

			$scope.setTopLevelY(elem, $scope.file, i, line);
			$scope.calcYChildren({
				elem: elem,
				siblings: $scope.file
			});
		}

		$scope.render($scope.file, 0);
	};

	$scope.render = function(file, level) {
		var g = d3.select("svg").append("g");
		var rectangles = g.selectAll(".rectlvl" + level).data(file).enter().append("rect");
		rectangles
			.attr("x", function(d, i) {
				return d.formatting.x;
			})
			.attr("y", function(d, i) {
				return d.formatting.y
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
			.style("stroke-width", function(d, i) {
				return d.formatting.strokeWidth;
			})
			.style("stroke", function(d, i) {
				return d.formatting.borderColor;
			})
			.style("class", ".rectlvl" + level)
			.on("click", function(d, index) {
				d.formatting.nodeselected = true;
				$scope.findNode(d.id, $scope.file);
			})
			.on("mouseover", function(d) {
				d3.select(this).style("stroke", "pink").style("strokeWidth", 4);
			})
			.on("mouseout", function(d) {
				if (!d.formatting.nodeselected) {
					d3.select(this).style("stroke", d.formatting.borderColor).style("strokeWidth", d.formatting.strokeWidth);
				}
			});

		var text = g.selectAll(".textlvl" + level).data(file).enter().append("text");
		text.text(function(d) {
				if (d.type !== 'formatting') {
					return d.title;
				}
				else {
					return '';
				}
			})
			.attr("x", function(d) {
				if (d.type !== 'formatting') {
					return d.formatting.x + (d.formatting.width / 2);
				}
				else {
					return 0;
				}
			})
			.attr("y", function(d) {
				if (d.type !== 'formatting') {
					if (d.children.length > 0) {
						return d.formatting.y + $scope.textPadding
					}
					else {
						return d.formatting.y + (d.formatting.height / 2);
					}
				}
				else {
					return 0;
				}
			})
			.attr("fill", function(d) {
				return d.formatting.fontColor
			})
			.attr("font-family", function(d) {
				return d.formatting.fontFamily
			})
			.attr("font-size", function(d) {
				return d.formatting.fontSize
			})
			.attr("text-anchor", "middle");

		level = level + 1;

		for (var i = 0; i < file.length; i++) {
			var currentNode = file[i];
			if (currentNode.children.length > 0) {
				$scope.render(currentNode.children, level);
			}
		}

	};

	$scope.setTopLevelY = function(elem, siblings, elemIndex, line) {
		if (elemIndex == 0 || siblings[elemIndex - 1].type != 'formatting') {
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

			if (line > 1) {
				yOfPreviousLine = siblings[elemIndex - 2].formatting.y;
			}

			var heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex - 2));
			elem.formatting.y = lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
		}
	};

	// loops through array getting the height of the tallest element
	$scope.getHighestHeight = function(data, from, to) {
		var highest = 0;
		for (var i = from; i <= to; i++) {
			if (data[i].formatting.height > highest)
				highest = data[i].formatting.height;
		}
		return highest;
	}


	$scope.calcYChildren = function(renderObj) {

		// debug
		//alert('Line:' + i + ' X:' + elem.formatting.x + ' | Y:' + elem.formatting.y + ' ' + elem.title );
		var line = 0;

		for (var elemIndex = 0; elemIndex < renderObj.elem.children.length; elemIndex++) {
			var child = renderObj.elem.children[elemIndex];
			var siblings = renderObj.elem.children;

			child.formatting.line = line;

			// don't render or calculate y if this is a line break symbol
			if (child.type == 'formatting') {
				line++;
				continue;
			}
			//--------------------------------------------------------------------------------
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
				// + the height defined for the line break itself
				var lineBreakHeight = siblings[elemIndex - 1].formatting.height;
				var yOfPreviousLine = 0;

				if (line > 0) {
					yOfPreviousLine = siblings[elemIndex - 2].formatting.y;
				}

				var heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex - 2));
				child.formatting.y = lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
			}
			//--------------------------------------------------------------------------------

			$scope.calcYChildren({
				elem: child,
				siblings: child.children
			});
		}
	};

	$scope.sumWidth = function sumWidth(elemIdx, elem, children, elemPeers) {
		if (elem.type == 'formatting') {
			return;
		}
		//elem.formatting.width = 0;
		elem.formatting.x = 0;
		var widthPerLine = [0, 0, 0, 0, 0];
		var idx = 0;

		// set the x of the element to the right of the previous element or zero if brand new line
		var previousElementIdx = elemIdx - 1;
		if (previousElementIdx >= 0) {
			if (elemPeers[previousElementIdx].type != 'formatting') {
				elem.formatting.x = elemPeers[previousElementIdx].formatting.x + elemPeers[previousElementIdx].formatting.width + $scope.padding;
			}
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (child.type == 'formatting') {
				idx++;
				continue;
			}

			// initialize the x of the child element a bit to the right of the border of the elem.
			// This will change further down if the element has sibillings.
			child.formatting.x = elem.formatting.x + $scope.padding;

			// if the element has sibilling, offset the x taking into account the x of the sibilling
			var previousChildIdx = i - 1;
			if (previousChildIdx >= 0) {
				if (children[previousChildIdx].type != 'formatting') {
					child.formatting.x = children[previousChildIdx].formatting.x + children[previousChildIdx].formatting.width + $scope.padding;
				}
			}

			if (child.children.length > 0) {
				$scope.sumWidth(i, child, child.children, children);
			}
			if (child.formatting.width < $scope.minWidth) {
				child.formatting.width = $scope.defaultWidth;
			}

			// save width for the current line
			widthPerLine[idx] = widthPerLine[idx] + child.formatting.width + $scope.padding;
		};

		// Sort the line widths so we can get the heighest number. The width of the elem must be the 
		// at least the width of the longest line (assuming page breaks)
		widthPerLine.sort(function(a, b) {
			return a - b
		});

		var minWidthCalc = widthPerLine[widthPerLine.length - 1] + ($scope.padding);
		if (elem.formatting.width < minWidthCalc) {
			elem.formatting.width = minWidthCalc;
		}

		if (elem.formatting.width < $scope.minWidth) {
			elem.formatting.width = $scope.minWidth;
		}
	};

	$scope.sumHeight = function sumHeight(elemIdx, elem, children, elemPeers) {
		if (elem.type == 'formatting') {
			return;
		}
		var heightPerLine = [0, 0, 0, 0, 0];
		var idx = 0;
		elem.formatting.y = 0;

		//		var previousElementIdx = elemIdx - 1;
		//		if (previousElementIdx >= 0) {
		//			if (elemPeers[previousElementIdx].type == 'formatting') {
		//				elem.formatting.y = elemPeers[previousElementIdx].formatting.y + elemPeers[previousElementIdx].height + $scope.padding;
		//			}
		//		}  

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (child.type === 'formatting') {
				idx++;
				continue;
			}

			// initialize the y of the child element to the bottom of the top border of the elem.
			// This will change further down if there are line breaks as sibilling elements.
			child.formatting.y = elem.formatting.y + $scope.topPadding;

			// if the element has sibilling, offset the x taking into account the x of the sibilling
			//			var previousChildIdx = i - 1;
			//			if (previousChildIdx >= 0) {
			//				if (children[previousChildIdx].type == 'formatting') {
			//					child.formatting.y = children[previousChildIdx].formatting.y + children[previousChildIdx].height + $scope.padding;
			//				}
			//			}  

			if (child.children.length > 0) {
				$scope.sumHeight(i, child, child.children, children);
			}
			if (child.formatting.height < $scope.minHeight) {
				child.formatting.height = $scope.defaultHeight;
			}

			// save height for the current line
			if (child.formatting.height > heightPerLine[idx]) {
				heightPerLine[idx] = child.formatting.height + $scope.padding;
			}

			// debug
			//			alert('Line ' + idx + '| child ' + child.title + ' | child height: ' + child.height + ' | elem ' + elem.title + ' | ' + heightPerLine[idx]);
		};

		// store the number of lines in the elem for helping with rendering later.
		if (elem.type != 'formatting') {
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
		var elemExpectedMinHeight = (totalHeight + $scope.padding + $scope.topPadding);

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


	$scope.findDragOver = function(objArr, mousex, mousey, highlight, holder, idOfObjBeingDragged) {
		for (var i = 0; i < objArr.length; i++) {
			var obj = objArr[i];

			if (obj.id !== idOfObjBeingDragged) {
				console.log('mousex: ' + mousex + ' mousey: ' + mousey + ' objx: ' + obj.x + ' obj-width: ' + obj.w + ' objy: ' + obj.y + ' obj-bottom: ' + obj.h);
				if (mousex >= obj.x && mousex <= (Number(obj.x) + Number(obj.w))) {
					if (mousey >= obj.y && mousey <= (Number(obj.y) + Number(obj.h))) {
						// Yes, the mouse is on a droppable area
						// Lets change the background color
						console.log('yes - found id ' + obj.id);
						holder.push(obj);

						if (highlight) {
							d3.select("#id" + obj.id).classed("somethingover", true)
						}
					}
					else {
						// Nope, we did not hit any objects yet
						if (highlight) {
							d3.select("#id" + obj.id).classed("somethingover", false)
						}
						console.log('nope, no match for id ' + obj.id);
					}
				}
				else {
					// Nope, we did not hit any objects yet
					if (highlight) {
						d3.select("#id" + obj.id).classed("somethingover", false)
					}
					console.log('nope, no match for id ' + obj.id);

				}
			}
			if (obj.children.length > 0) {
				$scope.findDragOver(obj.children, mousex, mousey, highlight, holder, idOfObjBeingDragged)
			}
		}
	}


	$scope.dragstart = function(d) {
		d.originalx = d.x;
		d.originaly = d.y;
		// initialise the holder of overlapping objects
		$scope.holder = [];
	}

	$scope.dragend = function(d) {
		var obj = d3.select(this);
		console.log('HOLDER END: ' + $scope.holder);
		// if we end the drag without overlapping with any other objects, we "cancel" the drag
		// by returning the object to its original position
		if ($scope.holder.length === 0) {
			d.x = d.originalx;
			d.y = d.originaly;
			obj.attr("x", d.x);
			obj.attr("y", d.y);
		}
	}




	$scope.dragmove = function(d) {
		// initialise list of overlapping objects
		$scope.holder = [];
		var obj = d3.select(this);
		d.x = d3.event.x;
		d.y = d3.event.y;
		obj.attr("x", d.x);
		obj.attr("y", d.y);
		$scope.findDragOver($scope.file, d3.event.x, d3.event.y, true, $scope.holder, d.id);
		console.log('HOLDER: ' + $scope.holder);
	}


	$scope.$watch("file", function(newValue, oldValue) {
		$scope.draw();
	}, true);

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
	$scope.applyChanges = function() {
		$scope.draw();
	}

	$scope.makeTaller = function() {
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height + 20;
	}

	$scope.makeShorter = function() {
		$scope.currentNode.formatting.height = $scope.currentNode.formatting.height - 20;
	}

	$scope.makeLonger = function() {
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width + 20;
	}

	$scope.makeLessLong = function() {
		$scope.currentNode.formatting.width = $scope.currentNode.formatting.width - 20;
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

}]);
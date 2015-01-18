(function() {
  'use strict';

  angular.module('treeApp', ['ui.tree', 'colorpicker.module', 'ngDialog', 'xeditable'])
  .controller('treeCtrl', ['$scope', '$parse', 'ngDialog', function($scope, $parse, ngDialog) {
	$scope.canvas = new fabric.Canvas('c');
	$scope.groups = new Array();
	$scope.tops = 0;
	$scope.minWidth = 100;
	$scope.minHeight = 100;
	$scope.padding = 10;  
	$scope.topPadding = 30;  
	$scope.editorEnabled = false;
	$scope.showJson = false;
	$scope.shapes = ['rectangle', 'circle', 'triangle', 'elipse'];

	
    $scope.data = [{ "envId": 1, "envName": "name1", "nodes": [{
      "id": 2,
	  "type": "node",
      "title": "node2",
	  "formatting": {
			"strokeWidth": 2,
			"showas": 'rectangle',
			"borderColor": 'black',
			"fill": '#B19CD8',
			"fontFamily" : 'Verdana, Geneva, sans-serif',
			"fontColor" : '#FFFFFF',
			"fontSize" : 10,
			"level": 0
		},
	  "width" : 0,
	  "height" : 0,
      "children": [
        {
          "id": 21,
		  "type": "node",
          "title": "node2.1",
		  "formatting": {
				"strokeWidth": 2,
				"showas": 'rectangle',
				"borderColor": 'black',
				"fill": '#B19CD8',
				"fontFamily" : 'Verdana, Geneva, sans-serif',
				"fontColor" : '#FFFFFF',
				"fontSize" : 10,
				"level": 1
			},
		  "width" : 0,
		  "height" : 0,
          "children": []
        },
        {
          "id": 22,
		  "type": "node",
          "title": "node2.2",
		  "formatting": {
				"strokeWidth": 2,
				"showas": 'rectangle',
				"borderColor": 'black',
				"fill": '#B19CD8',
				"fontFamily" : 'Verdana, Geneva, sans-serif',
				"fontColor" : '#FFFFFF',
				"fontSize" : 10,
				"level": 0
			},
		  "width" : 0,
		  "height" : 0,
          "children": []
        }
      ],
    }, {
      "id": 3,
      "type": "node",
      "title": "node3",
		  "formatting": {
				"strokeWidth": 2,
				"showas": 'rectangle',
				"borderColor": 'black',
				"fill": '#B19CD8',
				"fontFamily" : 'Verdana, Geneva, sans-serif',
				"fontColor" : '#FFFFFF',
				"fontSize" : 10,
				"level": 0
			},
	  "width" : 0,
	  "height" : 0,
      "children": [
        {
          "id": 31,
		  "type": "node",
          "title": "node3.1",
		  "formatting": {
				"strokeWidth": 2,
				"showas": 'rectangle',
				"borderColor": 'black',
				"fill": '#B19CD8',
				"fontFamily" : 'Verdana, Geneva, sans-serif',
				"fontColor" : '#FFFFFF',
				"fontSize" : 10,
				"level": 0
			},
		  "width" : 0,
		  "height" : 0,
          "children": []
        }
      ],
    }]},
    {"envId": 2, "envName": "test2", "nodes": []}];
	
	$scope.referencesPerLevel = [];
	
    $scope.buildReferencesToNodesPerLevel = function() {
		$scope.referencesPerLevel = [];
		$scope.recurseNodes($scope.data, 0);
    };

	$scope.recurseNodes = function(nodes, level) {
	    nodes.forEach(function(node) {
			if (node.children.length > 0) {
				$scope.recurseNodes(node.children, level + 1);
			}
			if ($scope.referencesPerLevel.length === 0 || typeof $scope.referencesPerLevel[level] === 'undefined') {
				for (var i=0; i<=level; i++) {
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

	$scope.clickToOpen = function (currentNode) {
	    $scope.currentNode = currentNode.$modelValue;
        ngDialog.openConfirm({ template: SiteParameters.theme_directory + '/popup.html', scope: $scope });
    };
	
	$scope.applyFillColorToSibilings = function(currentNode) {
		$scope.buildReferencesToNodesPerLevel();
		var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];
		
		for (var i=0; i<nodesAtTheSameLevel.length; i++) {
			nodesAtTheSameLevel[i].formatting.fill = currentNode.formatting.fill;
		}
		
	}
	
	$scope.applyFormattingToSibilings = function(currentNode, field) {
		$scope.buildReferencesToNodesPerLevel();
		var nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];
		
		var sourceField = eval('currentNode.formatting.' + field);
		for (var i=0; i<nodesAtTheSameLevel.length; i++) {
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

    $scope.moveLastToTheBeginning = function () {
      var a = $scope.data.pop();
      $scope.data.splice(0,0, a);
    };

    $scope.addNewNode = function () {
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
			fontFamily : 'Verdana, Geneva, sans-serif',
			fontColor : '#FFFFFF',
			fontSize : 10,
			level: 0
		},
        children: []
      };
      $scope.data.splice(0,0, a);
    };

    $scope.addNewLineBreak = function () {
	  var a = {
        id: 10,
		type: 'formatting',
        title: 'linebreak',
		formatting: {height: 10},
        children: []
      };
      $scope.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.children.push({
        id: nodeData.id * 10 + nodeData.children.length,
		type: nodeData.type,
        title: nodeData.title + '.' + (nodeData.children.length + 1),
		width: 0,
		height: 0,
		formatting: {
			strokeWidth: 2,
			showas: 'rectangle',
			borderColor: 'black',
			fill: '#B19CD8',
			fontFamily : 'Verdana, Geneva, sans-serif',
			fontColor : '#FFFFFF',
			fontSize : 10,
			level: nodeData.formatting.level + 1
		},
        children: []
      });
    };

    $scope.collapseAll = function() {
      $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function() {
      $scope.$broadcast('expandAll');
    };

	$scope.draw = function draw() {
		// clear the canvas
	    $scope.canvas.clear();
		
		// calculate the width and height and x coordinate for all elements
		for(var i = 0; i<$scope.data.length; i++) {
		    var elem = $scope.data[i];
			$scope.sumWidth(i, elem, elem.children, $scope.data);
			$scope.sumHeight(i, elem, elem.children, $scope.data);
		}
		

		//calculate the y coordinate and render all elements
		var offset = 0;
		var offsetTop = 0;
		var heighest = 0;
		var line = 0;
		for(var i=0; i<$scope.data.length; i++) {
			var elem = $scope.data[i];
		    elem.formatting.line = line;
			
			// don't render or calculate y if this is a line break symbol
			if (elem.type == 'formatting') {
				line++;
				continue;
			}
			
			$scope.setTopLevelY(elem, $scope.data, i, line);
		    $scope.render({elem:elem, siblings:$scope.data});
		}
	};

	$scope.setTopLevelY = function(elem, siblings, elemIndex, line) {
		if (elemIndex == 0 || siblings[elemIndex-1].type != 'formatting') {
			if (elemIndex == 0) {
				elem.formatting.y = 0;
			} else {
				elem.formatting.y = siblings[elemIndex-1].formatting.y;
			}
		} else {
			// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling
			// + the height defined for the line break itself
			var lineBreakHeight = siblings[elemIndex-1].formatting.height;
			var yOfPreviousLine = 0;
			
			if (line > 1) {
				yOfPreviousLine = siblings[elemIndex-2].formatting.y;
			}
			
			var heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex-2));
			elem.formatting.y =  lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
		}
	};
	
	// loops through array getting the height of the tallest element
	$scope.getHighestHeight = function(data, from, to) {
		var highest = 0;
		for (var i = from; i <= to; i++) {
			if (data[i].height > highest) 
				highest = data[i].height;
		}
		return highest;
	}


	$scope.render = function render(renderObj) {

    	// top is relative to the origin. Setting originX and Y to be center of the group. Therefore, to move the text to the top, we need to move it
		// by half the height of the object containing it minus a padding margin.
		var textTop = 0;
		// if it has children, set text at the top of poligon, to give space to the children to be rendered
		if (renderObj.elem.children.length > 0) {
			var textTop = -((renderObj.elem.height / 2) - $scope.padding);
		}
		
		var text = new fabric.Text(renderObj.elem.title, { fill : renderObj.elem.formatting.fontColor, fontSize: renderObj.elem.formatting.fontSize, fontFamily: renderObj.elem.formatting.fontFamily, originX: 'center', originY: 'center', top: textTop });
		var poligon = $scope.renderPoligon(renderObj.elem);
		var group = new fabric.Group([ poligon, text ], {
					  lockScalingX: false,
					  lockScalingY: false,
					  hasRotatingPoint: false,
					  transparentCorners: false,
					  left: renderObj.elem.formatting.x,
					  top: renderObj.elem.formatting.y,
					  cornerSize: 7});

		$scope.canvas.add(group);
		
			// debug
		    //alert('Line:' + i + ' X:' + elem.formatting.x + ' | Y:' + elem.formatting.y + ' ' + elem.title );
		var line = 0;

		for(var elemIndex = 0; elemIndex < renderObj.elem.children.length; elemIndex++) {
			var child = renderObj.elem.children[elemIndex];
			var siblings = renderObj.elem.children;
			
			child.formatting.line = line;
			
			// don't render or calculate y if this is a line break symbol
			if (child.type == 'formatting') {
				line++;
				continue;
			}			
		    //--------------------------------------------------------------------------------
			if (elemIndex == 0 || siblings[elemIndex-1].type != 'formatting') {
				if (elemIndex == 0) {
					child.formatting.y = renderObj.elem.formatting.y + $scope.topPadding;
				} else {
					child.formatting.y = siblings[elemIndex-1].formatting.y;
				}
			} else {
				// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling
				// + the height defined for the line break itself
				var lineBreakHeight = siblings[elemIndex-1].formatting.height;
				var yOfPreviousLine = 0;
				
				if (line > 0) {
					yOfPreviousLine = siblings[elemIndex-2].formatting.y;
				}
				
				var heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex-2));
				child.formatting.y =  lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;
			}
		    //--------------------------------------------------------------------------------
			
			$scope.render({elem:child, siblings:child.children});
		}
	};

	$scope.renderPoligon = function renderPoligon(elem) {
		if (elem.formatting.showas == 'rectangle') {
			return new fabric.Rect({
							width: elem.width,
							height: elem.height,
							originX: 'center',
							originY: 'center',
							rx: 10,
							ry: 10,
							strokeWidth: elem.formatting.strokeWidth, 
							stroke: elem.formatting.borderColor,
							//left: offset,
							//top: offsetTop,
							fill: elem.formatting.fill});
		} else if (elem.showas == 'circle') {
			return new fabric.Circle({
							radius: elem.width / 2,
							left: elem.formatting.x,
							top: elem.formatting.y,
							fill: elem.fill});
		}
	};

	$scope.sumWidth = function sumWidth(elemIdx, elem, children, elemPeers) {
	    if (elem.type == 'formatting') {
			return;
		}
	    elem.width = 0;
		elem.formatting.x = 0;
		var widthPerLine = [0,0,0,0,0];
		var idx = 0;

		// set the x of the element to the right of the previous element or zero if brand new line
		var previousElementIdx = elemIdx - 1;
		if (previousElementIdx >= 0) {
			if (elemPeers[previousElementIdx].type != 'formatting') {
				elem.formatting.x = elemPeers[previousElementIdx].formatting.x + elemPeers[previousElementIdx].width + $scope.padding;
			}
		}  
		
		for (var i=0; i < children.length; i++) {
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
					child.formatting.x = children[previousChildIdx].formatting.x + children[previousChildIdx].width + $scope.padding;
				}
			}  
						
			if (child.children.length > 0) {
				$scope.sumWidth(i, child, child.children, children);
			}
			if (child.width < $scope.minWidth) {
				child.width = $scope.minWidth;
			}
			
			// save width for the current line
			widthPerLine[idx] = widthPerLine[idx] + child.width + $scope.padding;
//			alert('Line ' + idx + '| child ' + child.title + ' | child width: ' + child.width + ' | elem ' + elem.title + ' | ' + widthPerLine[idx]);
		};
		
		// Sort the line widths so we can get the heighest number. The width of the elem must be the 
		// at least the width of the longest line (assuming page breaks)
		widthPerLine.sort(function(a, b) {return a-b});
		elem.width = widthPerLine[widthPerLine.length - 1] + ($scope.padding);
				
		if (elem.width < $scope.minWidth) {
			elem.width = $scope.minWidth;
		}
	};

	$scope.sumHeight = function sumHeight(elemIdx, elem, children, elemPeers) {
	    if (elem.type == 'formatting') {
			return;
		}
		var heightPerLine = [0,0,0,0,0];
		var idx = 0;
		elem.formatting.y = 0;
		
//		var previousElementIdx = elemIdx - 1;
//		if (previousElementIdx >= 0) {
//			if (elemPeers[previousElementIdx].type == 'formatting') {
//				elem.formatting.y = elemPeers[previousElementIdx].formatting.y + elemPeers[previousElementIdx].height + $scope.padding;
//			}
//		}  
		
		for (var i=0; i < children.length; i++) {
			var child = children[i];
			if (child.type == 'formatting') {
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
			if (child.height < $scope.minHeight) {
				child.height = $scope.minHeight;
			}
			
			// save height for the current line
			if (child.height > heightPerLine[idx]) {
				heightPerLine[idx] = child.height + $scope.padding;
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
		for(var i=0, len=elem.formatting.numLines; i<len; i++){
			totalHeight += heightPerLine[i];
			elem.formatting.heightPerLine[i] = {"line": i, "height": heightPerLine[i]};
		}
		var elemExpectedMinHeight = (totalHeight + $scope.padding + $scope.topPadding);
		elem.height = elemExpectedMinHeight;
		
		if (elem.height < $scope.minHeight) {
			if (children.length > 0) {
				elem.height = $scope.minHeight + $scope.padding * 2;
			} else {
				elem.height = $scope.minHeight;
			}
		}
	};

	$scope.print = function print(data, level) {
		level++;
		data.forEach(function(elem) { 
			console.log(level + ' ' + elem.title + ' ' + elem.width + ' height: ' + elem.height );
			$scope.print(elem.children, level);
		});
	};
	
	
	
	
	$scope.$watch("data", function( newValue, oldValue ) {
		$scope.draw();
    }, true);
				
	
  }])
.directive("focus", function($timeout) {
	return {
	    scope: {
			focus: '='
		},
		link: function (scope, element, attr) {
		    
			scope.$watch("focus", function(newValue, oldValue) {
				$timeout(function () {
					element[0].focus();
					element[0].select();
				});
			}, true);
			element.bind("keydown ", function (event) {
            if(event.which === 13) {
				$timeout(function () {
					scope.$apply(function() {
						scope.focus = !scope.focus;
					})
					
				});

               // event.preventDefault();
            }
        });
        }
	};
});

})();

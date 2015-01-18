(function() {
  'use strict';

  angular.module('treeApp', ['ui.tree', 'colorpicker.module', 'ngDialog', 'xeditable'])
  .controller('treeCtrl', function($scope, ngDialog) {
	$scope.canvas = new fabric.Canvas('c');
	$scope.groups = new Array();
	$scope.tops = 0;
	$scope.minWidth = 100;
	$scope.minHeight = 100;
	$scope.padding = 10;  
	$scope.topPadding = 30;  
	$scope.editorEnabled = false;
	$scope.shapes = ['rectangle', 'circle', 'triangle', 'elipse'];
	
    $scope.remove = function(scope) {
      scope.remove();
    };

	$scope.clickToOpen = function (currentNode) {
	    $scope.currentNode = currentNode.$modelValue;
		
        ngDialog.openConfirm({ template: 'popup.html', scope: $scope });
    };
	
    $scope.toggle = function(scope) {
      scope.toggle();
    };
	
	$scope.toggleEditor = function(currentNode) {
		currentNode.editorEnabled = !currentNode.editorEnabled;
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
		showas: 'rectangle',
		fill: 'blue',
		width: 0,
		height: 0,
        children: []
      };
      $scope.data.splice(0,0, a);
    };

    $scope.addNewLineBreak = function () {
	  var a = {
        id: 10,
		type: 'formatting',
        title: 'linebreak',
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
		showas: 'rectangle',
		fill: 'purple',
		width: 0,
		height: 0,
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
	    $scope.canvas.clear();
		$scope.data.forEach(function(elem) {
			$scope.sumWidth(elem, elem.children);
			$scope.sumHeight(elem, elem.children);
		});
		
		var offset = 0;
		var offsetTop = 0;
		var heighest = 0;
		$scope.data.forEach(function(elem) {
		    if (elem.type != 'formatting') {
				$scope.render(elem, offset, offsetTop);
				offset = offset + elem.width + $scope.padding;
				if (heighest < elem.height) {
					heighest = elem.height;
				}
			} else if (elem.type == 'formatting') {
				offsetTop = offsetTop + heighest + $scope.padding;
				offset = 0;
			}
		});
	};

	$scope.render = function render(elem, offset, offsetTop) {
//		var text = new fabric.Text(parent.title, { fontSize:10, fill: 'black', left: offset, top: offsetTop });
        // top is relative to the origin. Setting originX and Y to be center of the group. Therefore, to move the text to the top, we need to move it
		// by half the height of the object containing it minus a padding margin.
		var textTop = 0;
		// if it has children, set text at the top of poligon, to give space to the children to be rendered
		if (elem.children.length > 0) {
			var textTop = -((elem.height / 2) - $scope.padding);
		}
		
		var text = new fabric.Text(elem.title, { fontSize:10, fill: 'black', originX: 'center', originY: 'center', top: textTop });
		var poligon = $scope.renderPoligon(elem, offset, offsetTop);
		
		var group = new fabric.Group([ poligon, text ], {
					  lockScalingX: false,
					  lockScalingY: false,
					  hasRotatingPoint: false,
					  transparentCorners: false,
					  left: offset,
					  top: offsetTop,
					  cornerSize: 7});

//		$scope.canvas.add(poligon);
//		$scope.canvas.add(text);
		$scope.canvas.add(group);
		
		offsetTop = offsetTop + $scope.topPadding;
		elem.children.forEach(function(child) {
			offset = offset + $scope.padding;
			$scope.render(child, offset, offsetTop);
			offset = offset + child.width;
		});
		 
	};

	$scope.renderPoligon = function renderPoligon(elem, offset, offsetTop) {
		if (elem.showas == 'rectangle') {
			return new fabric.Rect({
							width: elem.width,
							height: elem.height,
							originX: 'center',
							originY: 'center',
							strokeWidth: 3, 
							stroke: elem.borderColor,
							//left: offset,
							//top: offsetTop,
							fill: elem.fill});
		} else if (elem.showas == 'circle') {
			return new fabric.Circle({
							radius: elem.width / 2,
							left: offset,
							top: offsetTop,
							fill: elem.fill});
		}
	};

	$scope.sumWidth = function sumWidth(parent, children) {
	    parent.width = 0;
		children.forEach(function(child) {
			if (child.children.length > 0) {
				$scope.sumWidth(child, child.children);
			}
			if (child.width < $scope.minWidth) {
				child.width = $scope.minWidth;
			}
			
			parent.width = parent.width + child.width + ($scope.padding * 2);
		});
		if (parent.width == 0) {
			parent.width = $scope.minWidth;
		}
	};

	$scope.sumHeight = function sumHeight(parent, children) {
		children.forEach(function(child) {
			if (child.children.length > 0) {
				$scope.sumHeight(child, child.children);
			}
			if (child.height < $scope.minHeight) {
				child.height = $scope.minHeight;
			}
			
			var parentExpectedMinHeight = (child.height + $scope.padding + $scope.topPadding);
			if (parent.height < parentExpectedMinHeight) {
				parent.height = parentExpectedMinHeight;
			}
		});
		
		if (parent.height < $scope.minHeight) {
			if (children.lenght > 0) {
				parent.height = $scope.minHeight + $scope.padding * 2;
			} else {
				parent.height = $scope.minHeight;
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
	
	
	
    $scope.data = [{
      "id": 2,
	  "type": "node",
      "title": "node2",
      "showas":"rectangle",
	  "fill" : "red",
	  "borderColor" : "black",
	  "width" : 0,
	  "height" : 0,
      "children": [
        {
          "id": 21,
		  "type": "node",
          "title": "node2.1",
		  "showas":"rectangle",
		  "fill" : "blue",
		  "borderColor" : "green",
		  "width" : 0,
		  "height" : 0,
          "children": []
        },
        {
          "id": 22,
		  "type": "node",
          "title": "node2.2",
		  "showas":"rectangle",
		  "fill" : "blue",
		  "borderColor" : "green",
		  "width" : 0,
		  "height" : 0,
          "children": []
        }
      ],
    }, {
      "id": 3,
      "type": "node",
      "title": "node3",
      "showas":"rectangle",
	  "fill" : "red",
	  "borderColor" : "yellow",
	  "width" : 0,
	  "height" : 0,
      "children": [
        {
          "id": 31,
		  "type": "node",
          "title": "node3.1",
		  "showas":"rectangle",
		  "fill" : "blue",
		  "width" : 0,
		  "height" : 0,
          "children": []
        }
      ],
    }];
	
	$scope.$watch("data", function( newValue, oldValue ) {
		$scope.draw();
    }, true);
				
	
  })
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

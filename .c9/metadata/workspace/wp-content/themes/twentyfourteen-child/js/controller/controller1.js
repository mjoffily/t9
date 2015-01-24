{"filter":false,"title":"controller1.js","tooltip":"/wp-content/themes/twentyfourteen-child/js/controller/controller1.js","undoManager":{"mark":7,"position":7,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":573,"column":0},"action":"insert","lines":["  .controller('treeCtrl', ['$scope', '$parse', 'ngDialog', function($scope, $parse, ngDialog) {","\t$scope.canvas = new fabric.Canvas('c');","\t$scope.groups = new Array();","\t$scope.tops = 0;","\t$scope.minWidth = 100;","\t$scope.minHeight = 100;","\t$scope.padding = 10;  ","\t$scope.topPadding = 30;  ","\t$scope.editorEnabled = false;","\t$scope.showJson = false;","\t$scope.shapes = ['rectangle', 'circle', 'triangle', 'elipse'];","","\t","    $scope.data = [{ \"envId\": 1, \"envName\": \"name1\", \"nodes\": [{","      \"id\": 2,","\t  \"type\": \"node\",","      \"title\": \"node2\",","\t  \"formatting\": {","\t\t\t\"strokeWidth\": 2,","\t\t\t\"showas\": 'rectangle',","\t\t\t\"borderColor\": 'black',","\t\t\t\"fill\": '#B19CD8',","\t\t\t\"fontFamily\" : 'Verdana, Geneva, sans-serif',","\t\t\t\"fontColor\" : '#FFFFFF',","\t\t\t\"fontSize\" : 10,","\t\t\t\"level\": 0","\t\t},","\t  \"width\" : 0,","\t  \"height\" : 0,","      \"children\": [","        {","          \"id\": 21,","\t\t  \"type\": \"node\",","          \"title\": \"node2.1\",","\t\t  \"formatting\": {","\t\t\t\t\"strokeWidth\": 2,","\t\t\t\t\"showas\": 'rectangle',","\t\t\t\t\"borderColor\": 'black',","\t\t\t\t\"fill\": '#B19CD8',","\t\t\t\t\"fontFamily\" : 'Verdana, Geneva, sans-serif',","\t\t\t\t\"fontColor\" : '#FFFFFF',","\t\t\t\t\"fontSize\" : 10,","\t\t\t\t\"level\": 1","\t\t\t},","\t\t  \"width\" : 0,","\t\t  \"height\" : 0,","          \"children\": []","        },","        {","          \"id\": 22,","\t\t  \"type\": \"node\",","          \"title\": \"node2.2\",","\t\t  \"formatting\": {","\t\t\t\t\"strokeWidth\": 2,","\t\t\t\t\"showas\": 'rectangle',","\t\t\t\t\"borderColor\": 'black',","\t\t\t\t\"fill\": '#B19CD8',","\t\t\t\t\"fontFamily\" : 'Verdana, Geneva, sans-serif',","\t\t\t\t\"fontColor\" : '#FFFFFF',","\t\t\t\t\"fontSize\" : 10,","\t\t\t\t\"level\": 0","\t\t\t},","\t\t  \"width\" : 0,","\t\t  \"height\" : 0,","          \"children\": []","        }","      ],","    }, {","      \"id\": 3,","      \"type\": \"node\",","      \"title\": \"node3\",","\t\t  \"formatting\": {","\t\t\t\t\"strokeWidth\": 2,","\t\t\t\t\"showas\": 'rectangle',","\t\t\t\t\"borderColor\": 'black',","\t\t\t\t\"fill\": '#B19CD8',","\t\t\t\t\"fontFamily\" : 'Verdana, Geneva, sans-serif',","\t\t\t\t\"fontColor\" : '#FFFFFF',","\t\t\t\t\"fontSize\" : 10,","\t\t\t\t\"level\": 0","\t\t\t},","\t  \"width\" : 0,","\t  \"height\" : 0,","      \"children\": [","        {","          \"id\": 31,","\t\t  \"type\": \"node\",","          \"title\": \"node3.1\",","\t\t  \"formatting\": {","\t\t\t\t\"strokeWidth\": 2,","\t\t\t\t\"showas\": 'rectangle',","\t\t\t\t\"borderColor\": 'black',","\t\t\t\t\"fill\": '#B19CD8',","\t\t\t\t\"fontFamily\" : 'Verdana, Geneva, sans-serif',","\t\t\t\t\"fontColor\" : '#FFFFFF',","\t\t\t\t\"fontSize\" : 10,","\t\t\t\t\"level\": 0","\t\t\t},","\t\t  \"width\" : 0,","\t\t  \"height\" : 0,","          \"children\": []","        }","      ],","    }]},","    {\"envId\": 2, \"envName\": \"test2\", \"nodes\": []}];","\t","\t$scope.referencesPerLevel = [];","\t","    $scope.buildReferencesToNodesPerLevel = function() {","\t\t$scope.referencesPerLevel = [];","\t\t$scope.recurseNodes($scope.data, 0);","    };","","\t$scope.recurseNodes = function(nodes, level) {","\t    nodes.forEach(function(node) {","\t\t\tif (node.children.length > 0) {","\t\t\t\t$scope.recurseNodes(node.children, level + 1);","\t\t\t}","\t\t\tif ($scope.referencesPerLevel.length === 0 || typeof $scope.referencesPerLevel[level] === 'undefined') {","\t\t\t\tfor (var i=0; i<=level; i++) {","\t\t\t\t\tif (typeof $scope.referencesPerLevel[i] === 'undefined') {","\t\t\t\t\t\t$scope.referencesPerLevel[i] = [];","\t\t\t\t\t}","\t\t\t\t}","\t\t\t}","\t\t\t$scope.referencesPerLevel[level].push(node);","","\t\t});","\t};","\t","","    $scope.remove = function(scope) {","      scope.remove();","    };","","\t$scope.clickToOpen = function (currentNode) {","\t    $scope.currentNode = currentNode.$modelValue;","        ngDialog.openConfirm({ template: SiteParameters.theme_directory + '/popup.html', scope: $scope });","    };","\t","\t$scope.applyFillColorToSibilings = function(currentNode) {","\t\t$scope.buildReferencesToNodesPerLevel();","\t\tvar nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];","\t\t","\t\tfor (var i=0; i<nodesAtTheSameLevel.length; i++) {","\t\t\tnodesAtTheSameLevel[i].formatting.fill = currentNode.formatting.fill;","\t\t}","\t\t","\t}","\t","\t$scope.applyFormattingToSibilings = function(currentNode, field) {","\t\t$scope.buildReferencesToNodesPerLevel();","\t\tvar nodesAtTheSameLevel = $scope.referencesPerLevel[currentNode.formatting.level];","\t\t","\t\tvar sourceField = eval('currentNode.formatting.' + field);","\t\tfor (var i=0; i<nodesAtTheSameLevel.length; i++) {","\t\t\tvar destinationField = $parse(field, nodesAtTheSameLevel[i].formatting);","\t\t\tdestinationField.assign(sourceField);","//\t\t\t$scope.$eval('nodesAtTheSameLevel[i].formatting.' + field + ' = currentNode.formatting.' + field);","\t\t}","\t\t","\t}","\t","    $scope.toggle = function(scope) {","      scope.toggle();","    };","\t","\t$scope.toggleEditor = function(currentNode) {","\t\tcurrentNode.editorEnabled = !currentNode.editorEnabled;","\t}","","\t$scope.toggleJson = function() {","\t\t$scope.showJson = !$scope.showJson;","\t}","","    $scope.moveLastToTheBeginning = function () {","      var a = $scope.data.pop();","      $scope.data.splice(0,0, a);","    };","","    $scope.addNewNode = function () {","\t  var a = {","        id: 10,","\t\ttype: 'node',","        title: 'new entry',","\t\twidth: 0,","\t\theight: 0,","\t\tformatting: {","\t\t\tstrokeWidth: 2,","\t\t\tshowas: 'rectangle',","\t\t\tborderColor: 'black',","\t\t\tfill: '#B19CD8',","\t\t\tfontFamily : 'Verdana, Geneva, sans-serif',","\t\t\tfontColor : '#FFFFFF',","\t\t\tfontSize : 10,","\t\t\tlevel: 0","\t\t},","        children: []","      };","      $scope.data.splice(0,0, a);","    };","","    $scope.addNewLineBreak = function () {","\t  var a = {","        id: 10,","\t\ttype: 'formatting',","        title: 'linebreak',","\t\tformatting: {height: 10},","        children: []","      };","      $scope.data.splice(0,0, a);","    };","","    $scope.newSubItem = function(scope) {","      var nodeData = scope.$modelValue;","      nodeData.children.push({","        id: nodeData.id * 10 + nodeData.children.length,","\t\ttype: nodeData.type,","        title: nodeData.title + '.' + (nodeData.children.length + 1),","\t\twidth: 0,","\t\theight: 0,","\t\tformatting: {","\t\t\tstrokeWidth: 2,","\t\t\tshowas: 'rectangle',","\t\t\tborderColor: 'black',","\t\t\tfill: '#B19CD8',","\t\t\tfontFamily : 'Verdana, Geneva, sans-serif',","\t\t\tfontColor : '#FFFFFF',","\t\t\tfontSize : 10,","\t\t\tlevel: nodeData.formatting.level + 1","\t\t},","        children: []","      });","    };","","    $scope.collapseAll = function() {","      $scope.$broadcast('collapseAll');","    };","","    $scope.expandAll = function() {","      $scope.$broadcast('expandAll');","    };","","\t$scope.draw = function draw() {","\t\t// clear the canvas","\t    $scope.canvas.clear();","\t\t","\t\t// calculate the width and height and x coordinate for all elements","\t\tfor(var i = 0; i<$scope.data.length; i++) {","\t\t    var elem = $scope.data[i];","\t\t\t$scope.sumWidth(i, elem, elem.children, $scope.data);","\t\t\t$scope.sumHeight(i, elem, elem.children, $scope.data);","\t\t}","\t\t","","\t\t//calculate the y coordinate and render all elements","\t\tvar offset = 0;","\t\tvar offsetTop = 0;","\t\tvar heighest = 0;","\t\tvar line = 0;","\t\tfor(var i=0; i<$scope.data.length; i++) {","\t\t\tvar elem = $scope.data[i];","\t\t    elem.formatting.line = line;","\t\t\t","\t\t\t// don't render or calculate y if this is a line break symbol","\t\t\tif (elem.type == 'formatting') {","\t\t\t\tline++;","\t\t\t\tcontinue;","\t\t\t}","\t\t\t","\t\t\t$scope.setTopLevelY(elem, $scope.data, i, line);","\t\t    $scope.render({elem:elem, siblings:$scope.data});","\t\t}","\t};","","\t$scope.setTopLevelY = function(elem, siblings, elemIndex, line) {","\t\tif (elemIndex == 0 || siblings[elemIndex-1].type != 'formatting') {","\t\t\tif (elemIndex == 0) {","\t\t\t\telem.formatting.y = 0;","\t\t\t} else {","\t\t\t\telem.formatting.y = siblings[elemIndex-1].formatting.y;","\t\t\t}","\t\t} else {","\t\t\t// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling","\t\t\t// + the height defined for the line break itself","\t\t\tvar lineBreakHeight = siblings[elemIndex-1].formatting.height;","\t\t\tvar yOfPreviousLine = 0;","\t\t\t","\t\t\tif (line > 1) {","\t\t\t\tyOfPreviousLine = siblings[elemIndex-2].formatting.y;","\t\t\t}","\t\t\t","\t\t\tvar heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex-2));","\t\t\telem.formatting.y =  lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;","\t\t}","\t};","\t","\t// loops through array getting the height of the tallest element","\t$scope.getHighestHeight = function(data, from, to) {","\t\tvar highest = 0;","\t\tfor (var i = from; i <= to; i++) {","\t\t\tif (data[i].height > highest) ","\t\t\t\thighest = data[i].height;","\t\t}","\t\treturn highest;","\t}","","","\t$scope.render = function render(renderObj) {","","    \t// top is relative to the origin. Setting originX and Y to be center of the group. Therefore, to move the text to the top, we need to move it","\t\t// by half the height of the object containing it minus a padding margin.","\t\tvar textTop = 0;","\t\t// if it has children, set text at the top of poligon, to give space to the children to be rendered","\t\tif (renderObj.elem.children.length > 0) {","\t\t\tvar textTop = -((renderObj.elem.height / 2) - $scope.padding);","\t\t}","\t\t","\t\tvar text = new fabric.Text(renderObj.elem.title, { fill : renderObj.elem.formatting.fontColor, fontSize: renderObj.elem.formatting.fontSize, fontFamily: renderObj.elem.formatting.fontFamily, originX: 'center', originY: 'center', top: textTop });","\t\tvar poligon = $scope.renderPoligon(renderObj.elem);","\t\tvar group = new fabric.Group([ poligon, text ], {","\t\t\t\t\t  lockScalingX: false,","\t\t\t\t\t  lockScalingY: false,","\t\t\t\t\t  hasRotatingPoint: false,","\t\t\t\t\t  transparentCorners: false,","\t\t\t\t\t  left: renderObj.elem.formatting.x,","\t\t\t\t\t  top: renderObj.elem.formatting.y,","\t\t\t\t\t  cornerSize: 7});","","\t\t$scope.canvas.add(group);","\t\t","\t\t\t// debug","\t\t    //alert('Line:' + i + ' X:' + elem.formatting.x + ' | Y:' + elem.formatting.y + ' ' + elem.title );","\t\tvar line = 0;","","\t\tfor(var elemIndex = 0; elemIndex < renderObj.elem.children.length; elemIndex++) {","\t\t\tvar child = renderObj.elem.children[elemIndex];","\t\t\tvar siblings = renderObj.elem.children;","\t\t\t","\t\t\tchild.formatting.line = line;","\t\t\t","\t\t\t// don't render or calculate y if this is a line break symbol","\t\t\tif (child.type == 'formatting') {","\t\t\t\tline++;","\t\t\t\tcontinue;","\t\t\t}\t\t\t","\t\t    //--------------------------------------------------------------------------------","\t\t\tif (elemIndex == 0 || siblings[elemIndex-1].type != 'formatting') {","\t\t\t\tif (elemIndex == 0) {","\t\t\t\t\tchild.formatting.y = renderObj.elem.formatting.y + $scope.topPadding;","\t\t\t\t} else {","\t\t\t\t\tchild.formatting.y = siblings[elemIndex-1].formatting.y;","\t\t\t\t}","\t\t\t} else {","\t\t\t\t// this is a line break. The y of the element should be the y of heighest sibling of the previous line + the height of that sibling","\t\t\t\t// + the height defined for the line break itself","\t\t\t\tvar lineBreakHeight = siblings[elemIndex-1].formatting.height;","\t\t\t\tvar yOfPreviousLine = 0;","\t\t\t\t","\t\t\t\tif (line > 0) {","\t\t\t\t\tyOfPreviousLine = siblings[elemIndex-2].formatting.y;","\t\t\t\t}","\t\t\t\t","\t\t\t\tvar heightOfHeighestSiblingOfPreviousLine = $scope.getHighestHeight(siblings, 0, (elemIndex-2));","\t\t\t\tchild.formatting.y =  lineBreakHeight + yOfPreviousLine + heightOfHeighestSiblingOfPreviousLine;","\t\t\t}","\t\t    //--------------------------------------------------------------------------------","\t\t\t","\t\t\t$scope.render({elem:child, siblings:child.children});","\t\t}","\t};","","\t$scope.renderPoligon = function renderPoligon(elem) {","\t\tif (elem.formatting.showas == 'rectangle') {","\t\t\treturn new fabric.Rect({","\t\t\t\t\t\t\twidth: elem.width,","\t\t\t\t\t\t\theight: elem.height,","\t\t\t\t\t\t\toriginX: 'center',","\t\t\t\t\t\t\toriginY: 'center',","\t\t\t\t\t\t\trx: 10,","\t\t\t\t\t\t\try: 10,","\t\t\t\t\t\t\tstrokeWidth: elem.formatting.strokeWidth, ","\t\t\t\t\t\t\tstroke: elem.formatting.borderColor,","\t\t\t\t\t\t\t//left: offset,","\t\t\t\t\t\t\t//top: offsetTop,","\t\t\t\t\t\t\tfill: elem.formatting.fill});","\t\t} else if (elem.showas == 'circle') {","\t\t\treturn new fabric.Circle({","\t\t\t\t\t\t\tradius: elem.width / 2,","\t\t\t\t\t\t\tleft: elem.formatting.x,","\t\t\t\t\t\t\ttop: elem.formatting.y,","\t\t\t\t\t\t\tfill: elem.fill});","\t\t}","\t};","","\t$scope.sumWidth = function sumWidth(elemIdx, elem, children, elemPeers) {","\t    if (elem.type == 'formatting') {","\t\t\treturn;","\t\t}","\t    elem.width = 0;","\t\telem.formatting.x = 0;","\t\tvar widthPerLine = [0,0,0,0,0];","\t\tvar idx = 0;","","\t\t// set the x of the element to the right of the previous element or zero if brand new line","\t\tvar previousElementIdx = elemIdx - 1;","\t\tif (previousElementIdx >= 0) {","\t\t\tif (elemPeers[previousElementIdx].type != 'formatting') {","\t\t\t\telem.formatting.x = elemPeers[previousElementIdx].formatting.x + elemPeers[previousElementIdx].width + $scope.padding;","\t\t\t}","\t\t}  ","\t\t","\t\tfor (var i=0; i < children.length; i++) {","\t\t\tvar child = children[i];","\t\t\tif (child.type == 'formatting') {","\t\t\t\tidx++;","\t\t\t    continue;","\t\t\t}","","\t\t\t// initialize the x of the child element a bit to the right of the border of the elem.","\t\t\t// This will change further down if the element has sibillings.","\t\t\tchild.formatting.x = elem.formatting.x + $scope.padding;","\t\t\t","\t\t\t// if the element has sibilling, offset the x taking into account the x of the sibilling","\t\t\tvar previousChildIdx = i - 1;","\t\t\tif (previousChildIdx >= 0) {","\t\t\t\tif (children[previousChildIdx].type != 'formatting') {","\t\t\t\t\tchild.formatting.x = children[previousChildIdx].formatting.x + children[previousChildIdx].width + $scope.padding;","\t\t\t\t}","\t\t\t}  ","\t\t\t\t\t\t","\t\t\tif (child.children.length > 0) {","\t\t\t\t$scope.sumWidth(i, child, child.children, children);","\t\t\t}","\t\t\tif (child.width < $scope.minWidth) {","\t\t\t\tchild.width = $scope.minWidth;","\t\t\t}","\t\t\t","\t\t\t// save width for the current line","\t\t\twidthPerLine[idx] = widthPerLine[idx] + child.width + $scope.padding;","//\t\t\talert('Line ' + idx + '| child ' + child.title + ' | child width: ' + child.width + ' | elem ' + elem.title + ' | ' + widthPerLine[idx]);","\t\t};","\t\t","\t\t// Sort the line widths so we can get the heighest number. The width of the elem must be the ","\t\t// at least the width of the longest line (assuming page breaks)","\t\twidthPerLine.sort(function(a, b) {return a-b});","\t\telem.width = widthPerLine[widthPerLine.length - 1] + ($scope.padding);","\t\t\t\t","\t\tif (elem.width < $scope.minWidth) {","\t\t\telem.width = $scope.minWidth;","\t\t}","\t};","","\t$scope.sumHeight = function sumHeight(elemIdx, elem, children, elemPeers) {","\t    if (elem.type == 'formatting') {","\t\t\treturn;","\t\t}","\t\tvar heightPerLine = [0,0,0,0,0];","\t\tvar idx = 0;","\t\telem.formatting.y = 0;","\t\t","//\t\tvar previousElementIdx = elemIdx - 1;","//\t\tif (previousElementIdx >= 0) {","//\t\t\tif (elemPeers[previousElementIdx].type == 'formatting') {","//\t\t\t\telem.formatting.y = elemPeers[previousElementIdx].formatting.y + elemPeers[previousElementIdx].height + $scope.padding;","//\t\t\t}","//\t\t}  ","\t\t","\t\tfor (var i=0; i < children.length; i++) {","\t\t\tvar child = children[i];","\t\t\tif (child.type == 'formatting') {","\t\t\t\tidx++;","\t\t\t    continue;","\t\t\t}","","\t\t\t// initialize the y of the child element to the bottom of the top border of the elem.","\t\t\t// This will change further down if there are line breaks as sibilling elements.","\t\t\tchild.formatting.y = elem.formatting.y + $scope.topPadding;","\t\t\t","\t\t\t// if the element has sibilling, offset the x taking into account the x of the sibilling","//\t\t\tvar previousChildIdx = i - 1;","//\t\t\tif (previousChildIdx >= 0) {","//\t\t\t\tif (children[previousChildIdx].type == 'formatting') {","//\t\t\t\t\tchild.formatting.y = children[previousChildIdx].formatting.y + children[previousChildIdx].height + $scope.padding;","//\t\t\t\t}","//\t\t\t}  ","","\t\t\tif (child.children.length > 0) {","\t\t\t\t$scope.sumHeight(i, child, child.children, children);","\t\t\t}","\t\t\tif (child.height < $scope.minHeight) {","\t\t\t\tchild.height = $scope.minHeight;","\t\t\t}","\t\t\t","\t\t\t// save height for the current line","\t\t\tif (child.height > heightPerLine[idx]) {","\t\t\t\theightPerLine[idx] = child.height + $scope.padding;","\t\t\t}","\t\t\t","\t\t\t// debug","//\t\t\talert('Line ' + idx + '| child ' + child.title + ' | child height: ' + child.height + ' | elem ' + elem.title + ' | ' + heightPerLine[idx]);","\t\t};","","\t\t// store the number of lines in the elem for helping with rendering later.","\t\tif (elem.type != 'formatting') {","\t\t\telem.formatting.numLines = idx + 1;","\t\t}","\t\t// sum the height of each line for the children","\t\tvar totalHeight = 0;","\t\telem.formatting.heightPerLine = [];","\t\tfor(var i=0, len=elem.formatting.numLines; i<len; i++){","\t\t\ttotalHeight += heightPerLine[i];","\t\t\telem.formatting.heightPerLine[i] = {\"line\": i, \"height\": heightPerLine[i]};","\t\t}","\t\tvar elemExpectedMinHeight = (totalHeight + $scope.padding + $scope.topPadding);","\t\telem.height = elemExpectedMinHeight;","\t\t","\t\tif (elem.height < $scope.minHeight) {","\t\t\tif (children.length > 0) {","\t\t\t\telem.height = $scope.minHeight + $scope.padding * 2;","\t\t\t} else {","\t\t\t\telem.height = $scope.minHeight;","\t\t\t}","\t\t}","\t};","","\t$scope.print = function print(data, level) {","\t\tlevel++;","\t\tdata.forEach(function(elem) { ","\t\t\tconsole.log(level + ' ' + elem.title + ' ' + elem.width + ' height: ' + elem.height );","\t\t\t$scope.print(elem.children, level);","\t\t});","\t};","\t","\t","\t","\t","\t$scope.$watch(\"data\", function( newValue, oldValue ) {","\t\t$scope.draw();","    }, true);","\t\t\t\t","\t","  }])",".directive(\"focus\", function($timeout) {","\treturn {","\t    scope: {","\t\t\tfocus: '='","\t\t},","\t\tlink: function (scope, element, attr) {","\t\t    ","\t\t\tscope.$watch(\"focus\", function(newValue, oldValue) {","\t\t\t\t$timeout(function () {","\t\t\t\t\telement[0].focus();","\t\t\t\t\telement[0].select();","\t\t\t\t});","\t\t\t}, true);","\t\t\telement.bind(\"keydown \", function (event) {","            if(event.which === 13) {","\t\t\t\t$timeout(function () {","\t\t\t\t\tscope.$apply(function() {","\t\t\t\t\t\tscope.focus = !scope.focus;","\t\t\t\t\t})","\t\t\t\t\t","\t\t\t\t});","","               // event.preventDefault();","            }","        });","        }","\t};","});","","})();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":15},"end":{"row":0,"column":19},"action":"remove","lines":["tree"]},{"start":{"row":0,"column":15},"end":{"row":0,"column":16},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":16},"end":{"row":0,"column":17},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":17},"end":{"row":0,"column":18},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":18},"end":{"row":0,"column":19},"action":"insert","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":19},"end":{"row":0,"column":20},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":20},"end":{"row":0,"column":21},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":21},"end":{"row":0,"column":22},"action":"insert","lines":["m"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":573,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":29,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1421575849045,"hash":"d3500fcb96287cfdd676f78b09609217a5c89b11"}
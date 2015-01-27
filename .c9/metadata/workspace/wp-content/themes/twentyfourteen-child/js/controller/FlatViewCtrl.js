{"changed":true,"filter":false,"title":"FlatViewCtrl.js","tooltip":"/wp-content/themes/twentyfourteen-child/js/controller/FlatViewCtrl.js","value":"app.controller('flatViewCtrl', ['$scope', '$stateParams', 'titleFilter', function($scope, $stateParams, titleFilter) {\n\t$scope.searchname = \"\";\n\t$scope.searchvalue = \"\";\n\t$scope.searchtitle = \"\";\n\t\n\t// set the file selected in case the user came directly to this URL without selecting the file in the dropdown\n\t$scope.file = $scope.data[$stateParams.idx].nodes;\n\t\n\t// get the nodes list (flattned) to work with\n\t$scope.flatnodes = $scope.dataflat[$stateParams.idx].flatnodes;\n\t\n\t// initialise the number of columns in the grid to 4\n\t// TODO move this to some user specific environment setting\n\t$scope.numColumns = 4;\n\t\n\t// initialise the filtered nodes to be all of them (no filter applied yet)\n\t$scope.filterednodes = $scope.flatnodes;\n\t\n\t// watch the search criteria entered by the user on the filter  title field and apply filter\n\t$scope.$watch('searchtitle', function() {\n\t\t$scope.filter();\n\t});\n\t$scope.$watch('searchname', function() {\n\t\t$scope.filter();\n\t});\n\t$scope.$watch('searchvalue', function() {\n\t\t$scope.filter();\n\t});\n\n\t$scope.filter = function() {\n\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);\n\t\t$scope.filterednodes = nameFilter($scope.flatnodes, $scope.searchname);\n\t\t$scope.filterednodes = valueFilter($scope.flatnodes, $scope.searchname);\n\t\t\n\t}\n\t\n\t$scope.columns = function() {\n\t\treturn new Array(Number($scope.numColumns));\n\t};\n\t\n\t$scope.rows = function(num) {\n\t\tif (!$scope.isNumeric(num)) {\n\t\t\tnum = 4;\n\t\t}\n\t\tvar ret = 0;\n\t\tvar div = Math.floor($scope.filterednodes.length / num);\n\t\tvar mod = $scope.filterednodes.length % num;\n\t\tif (div < 1) {\n\t\t\tret = 1;\n\t\t}\n\t\telse if (mod !== 0) {\n\t\t\tret = div + 1;\n\t\t}\n\t\telse {\n\t\t\tret = div;\n\t\t}\n\t\tconsole.log('My ROWS ' + (ret));\n\n\t\treturn new Array(ret);\n\t};\n\n\t$scope.addRow = function(idx) {\n\t\t$scope.flatnodes[idx].metadata.push({\n\t\t\tname: \"newname\",\n\t\t\tvalue: \"newvalue\"\n\t\t});\n\t};\n\t$scope.removeRow = function(d) {\n\t\t$scope.flatnodes[idx].metadata.splice(d, 1);\n\t};\n\t\n \t$scope.isNumeric = function(n) {\n  \t\treturn !isNaN(parseFloat(n)) && isFinite(n);\n\t}\n\t\n}]);\n","undoManager":{"mark":65,"position":100,"stack":[[{"group":"doc","deltas":[{"start":{"row":20,"column":4},"end":{"row":20,"column":5},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":5},"end":{"row":20,"column":6},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":6},"end":{"row":20,"column":7},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":7},"end":{"row":20,"column":8},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":8},"end":{"row":20,"column":9},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":9},"end":{"row":20,"column":10},"action":"insert","lines":["f"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":10},"end":{"row":20,"column":11},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":11},"end":{"row":20,"column":12},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":12},"end":{"row":20,"column":13},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":13},"end":{"row":20,"column":14},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":14},"end":{"row":20,"column":15},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":15},"end":{"row":20,"column":17},"action":"insert","lines":["()"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":17},"end":{"row":20,"column":18},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":21,"column":0},"end":{"row":22,"column":0},"action":"remove","lines":["\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]},{"start":{"row":22,"column":0},"end":{"row":23,"column":0},"action":"insert","lines":["\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":0},"end":{"row":22,"column":1},"action":"remove","lines":["\t"]}]}],[{"group":"doc","deltas":[{"start":{"row":21,"column":4},"end":{"row":22,"column":0},"action":"insert","lines":["",""]},{"start":{"row":22,"column":0},"end":{"row":22,"column":1},"action":"insert","lines":["\t"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":1},"end":{"row":22,"column":2},"action":"insert","lines":["$"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":2},"end":{"row":22,"column":3},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":3},"end":{"row":22,"column":4},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":4},"end":{"row":22,"column":5},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":5},"end":{"row":22,"column":6},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":6},"end":{"row":22,"column":7},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":7},"end":{"row":22,"column":8},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":8},"end":{"row":22,"column":9},"action":"insert","lines":["f"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":9},"end":{"row":22,"column":10},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":10},"end":{"row":22,"column":11},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":11},"end":{"row":22,"column":12},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":12},"end":{"row":22,"column":13},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":13},"end":{"row":22,"column":14},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":14},"end":{"row":22,"column":16},"action":"insert","lines":["()"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":16},"end":{"row":22,"column":17},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":17},"end":{"row":22,"column":18},"action":"insert","lines":["{"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":18},"end":{"row":24,"column":2},"action":"insert","lines":["","\t\t","\t}"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":14},"end":{"row":22,"column":15},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":15},"end":{"row":22,"column":16},"action":"insert","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":16},"end":{"row":22,"column":17},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":17},"end":{"row":22,"column":18},"action":"insert","lines":["f"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":18},"end":{"row":22,"column":19},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":19},"end":{"row":22,"column":20},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":20},"end":{"row":22,"column":21},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":21},"end":{"row":22,"column":22},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":22},"end":{"row":22,"column":23},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":23},"end":{"row":22,"column":24},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":24},"end":{"row":22,"column":25},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"remove","lines":["\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]},{"start":{"row":24,"column":0},"end":{"row":25,"column":0},"action":"insert","lines":["\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":24,"column":0},"end":{"row":25,"column":0},"action":"remove","lines":["\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]},{"start":{"row":23,"column":0},"end":{"row":24,"column":0},"action":"insert","lines":["\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":23,"column":1},"end":{"row":23,"column":2},"action":"insert","lines":["\t"]}]}],[{"group":"doc","deltas":[{"start":{"row":26,"column":0},"end":{"row":29,"column":0},"action":"remove","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]},{"start":{"row":25,"column":0},"end":{"row":28,"column":0},"action":"insert","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":0},"end":{"row":28,"column":0},"action":"remove","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]},{"start":{"row":24,"column":0},"end":{"row":27,"column":0},"action":"insert","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]}]}],[{"group":"doc","deltas":[{"start":{"row":24,"column":0},"end":{"row":27,"column":0},"action":"remove","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]},{"start":{"row":23,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]}]}],[{"group":"doc","deltas":[{"start":{"row":23,"column":0},"end":{"row":26,"column":0},"action":"remove","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]},{"start":{"row":22,"column":0},"end":{"row":25,"column":0},"action":"insert","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":0},"end":{"row":28,"column":0},"action":"insert","lines":["\t$scope.$watch('searchname', function() {","\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);","\t});",""]}]}],[{"group":"doc","deltas":[{"start":{"row":21,"column":0},"end":{"row":22,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":21,"column":0},"end":{"row":22,"column":0},"action":"remove","lines":["\t\t$scope.filter();",""]},{"start":{"row":22,"column":0},"end":{"row":23,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":22,"column":0},"end":{"row":23,"column":0},"action":"remove","lines":["\t\t$scope.filter();",""]},{"start":{"row":23,"column":0},"end":{"row":24,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":24,"column":0},"end":{"row":25,"column":0},"action":"remove","lines":["\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":24,"column":0},"end":{"row":25,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":24,"column":0},"end":{"row":25,"column":0},"action":"remove","lines":["\t\t$scope.filter();",""]},{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"remove","lines":["\t\t$scope.filter();",""]},{"start":{"row":26,"column":0},"end":{"row":27,"column":0},"action":"insert","lines":["\t\t$scope.filter();",""]}]}],[{"group":"doc","deltas":[{"start":{"row":27,"column":0},"end":{"row":28,"column":0},"action":"remove","lines":["\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":22},"end":{"row":25,"column":26},"action":"remove","lines":["name"]},{"start":{"row":25,"column":22},"end":{"row":25,"column":23},"action":"insert","lines":["v"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":23},"end":{"row":25,"column":24},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":24},"end":{"row":25,"column":25},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":25},"end":{"row":25,"column":26},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":26},"end":{"row":25,"column":27},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":0},"end":{"row":32,"column":0},"action":"insert","lines":["\t\t$scope.filterednodes = titleFilter($scope.flatnodes, $scope.searchtitle);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":25},"end":{"row":31,"column":30},"action":"remove","lines":["title"]},{"start":{"row":31,"column":25},"end":{"row":31,"column":26},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":26},"end":{"row":31,"column":27},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":27},"end":{"row":31,"column":28},"action":"insert","lines":["m"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":28},"end":{"row":31,"column":29},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":67},"end":{"row":31,"column":72},"action":"remove","lines":["title"]},{"start":{"row":31,"column":67},"end":{"row":31,"column":68},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":68},"end":{"row":31,"column":69},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":69},"end":{"row":31,"column":70},"action":"insert","lines":["m"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":70},"end":{"row":31,"column":71},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":0},"end":{"row":33,"column":0},"action":"insert","lines":["\t\t$scope.filterednodes = nameFilter($scope.flatnodes, $scope.searchname);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":29},"end":{"row":31,"column":30},"action":"insert","lines":["V"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":30},"end":{"row":31,"column":31},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":31},"end":{"row":31,"column":32},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":32},"end":{"row":31,"column":33},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":33},"end":{"row":31,"column":34},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":33},"end":{"row":31,"column":34},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":32},"end":{"row":31,"column":33},"action":"remove","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":31},"end":{"row":31,"column":32},"action":"remove","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":31},"end":{"row":31,"column":32},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":32},"end":{"row":31,"column":33},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":33},"end":{"row":31,"column":34},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":33},"end":{"row":31,"column":34},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":32},"end":{"row":31,"column":33},"action":"remove","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":31},"end":{"row":31,"column":32},"action":"remove","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":30},"end":{"row":31,"column":31},"action":"remove","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":31,"column":29},"end":{"row":31,"column":30},"action":"remove","lines":["V"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":28},"end":{"row":32,"column":29},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":27},"end":{"row":32,"column":28},"action":"remove","lines":["m"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":26},"end":{"row":32,"column":27},"action":"remove","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":25},"end":{"row":32,"column":26},"action":"remove","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":25},"end":{"row":32,"column":26},"action":"insert","lines":["v"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":26},"end":{"row":32,"column":27},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":27},"end":{"row":32,"column":28},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":28},"end":{"row":32,"column":29},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":32,"column":29},"end":{"row":32,"column":30},"action":"insert","lines":["e"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":32,"column":30},"end":{"row":32,"column":30},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1422328240612}
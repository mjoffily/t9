{"changed":true,"filter":false,"title":"focus.js","tooltip":"/wp-content/themes/twentyfourteen-child/js/directives/focus.js","value":".directive(\"focus\", function($timeout) {\n\treturn {\n\t    scope: {\n\t\t\tfocus: '='\n\t\t},\n\t\tlink: function (scope, element, attr) {\n\t\t    \n\t\t\tscope.$watch(\"focus\", function(newValue, oldValue) {\n\t\t\t\t$timeout(function () {\n\t\t\t\t\telement[0].focus();\n\t\t\t\t\telement[0].select();\n\t\t\t\t});\n\t\t\t}, true);\n\t\t\telement.bind(\"keydown \", function (event) {\n            if(event.which === 13) {\n\t\t\t\t$timeout(function () {\n\t\t\t\t\tscope.$apply(function() {\n\t\t\t\t\t\tscope.focus = !scope.focus;\n\t\t\t\t\t})\n\t\t\t\t\t\n\t\t\t\t});\n\n               // event.preventDefault();\n            }\n        });\n        }\n\t};\n});","undoManager":{"mark":-1,"position":0,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":27,"column":3},"action":"insert","lines":[".directive(\"focus\", function($timeout) {","\treturn {","\t    scope: {","\t\t\tfocus: '='","\t\t},","\t\tlink: function (scope, element, attr) {","\t\t    ","\t\t\tscope.$watch(\"focus\", function(newValue, oldValue) {","\t\t\t\t$timeout(function () {","\t\t\t\t\telement[0].focus();","\t\t\t\t\telement[0].select();","\t\t\t\t});","\t\t\t}, true);","\t\t\telement.bind(\"keydown \", function (event) {","            if(event.which === 13) {","\t\t\t\t$timeout(function () {","\t\t\t\t\tscope.$apply(function() {","\t\t\t\t\t\tscope.focus = !scope.focus;","\t\t\t\t\t})","\t\t\t\t\t","\t\t\t\t});","","               // event.preventDefault();","            }","        });","        }","\t};","});"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":12},"end":{"row":0,"column":17},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":11,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1421796713583}
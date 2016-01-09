app.directive("focus", function($timeout) {
	return {
	    scope: {
			focus: '='
		},
		link: function (scope, element, attr) {
		    
			scope.$watch("focus", function(newValue, oldValue) {
				$timeout(function () {
					console.log("focus watch");
					//element[0].focus();
					//element[0].select();
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

app.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

app.directive("palette", function($timeout) {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
			scope.$apply($(element).simpleSwatchPicker());
			
			scope.$watch('currentNode.formatting.fill', function(newVal) {
        $(element).val('value', newVal);
      });
    }
  };
});
			

app.directive('colorchooser', function($compile) {
  return {
    scope: {
      'myColor': '='
    },
    link: function(scope, element, attrs) {
      scope.opened = true;
      scope.toggle = function() {
        scope.opened = !scope.opened;
        scope.palette.removeClass(scope.opened ? 'closed' : 'opened');
        scope.palette.addClass(scope.opened ? 'opened' : 'closed');
      }

      // scope.myColor = "black";
      scope.buildChip = function() {
        var chip = '';
        for (var r = 0; r < settings['rows']; r++) {
          for (var c = 0; c < settings['cols']; c++) {
            var h = getComponent('hue', c, r);
            var s = getComponent('saturation', c, r);
            var v = getComponent('value', c, r);
            chip = chip + '<div managecolor my-color="myColor" class="sspChip" style="background-color: hsl(' + h + ',' + s + '%, ' + v + '%);"></div>';
          }
        }
        return chip;
      }

      scope.buildTemplate = function() {
        var template = '<div class="simpleSwatchPicker"><div><div class="sspSelectedChip" ></div></div><div class="sspPalette closed" >';
        template = template + scope.buildChip() + '</div></div></div>';
        return template;
      }

      // Default settings values
      var settings = {
        'palette': 'default',
        'rows': 6,
        'cols': 12,
        'saturation': [70.0, 100.0, 'rows'],
        'hue': [0.0, 300.0, 'cols'],
        'value': [40.0, 98.0, 'rows'],
        'selectMessage': "click to choose color",
        'swatchContainer': ''
      };

      // Preset palettes. Want to save space? Delete 
      // the ones you're not using! 
      var presetPalettes = {
        'default': {},
        'warm': {
          'hue': [0.0, 60.0, 'cols']
        },
        'cool': {
          'hue': [150.0, 280.0, 'cols']
        },
        'moody': {
          'saturation': [80.0, 12.0, 'rows'],
          'hue': [0.0, 300.0, 'cols'],
          'value': [30.0, 70.0, 'rows']
        },
        'primary': {
          'saturation': [100.0, 100.0, 'rows'],
          'hue': [0.0, 300.0, 'cols'],
          'value': [50.0, 98.0, 'rows']
        },
        'pastel': {
          'saturation': [50.0, 90.0, 'rows'],
          'hue': [0.0, 300.0, 'cols'],
          'value': [70.0, 98.0, 'rows']
        }
      }

      // Set palette size for # of rows, cols
      scope.setPaletteSize = function() {
        var chip = angular.element(element.children().children()[1]).children()[0];
        var selectChip = angular.element(element.children().children()[0]).children()[0];
        var boxSelectChip = selectChip.getBoundingClientRect();
        var left = boxSelectChip.width;

        scope.palette.css({
          'width': (chip.offsetWidth * settings['cols']) + "px",
          'height': (chip.offsetHeight * settings['rows']) + "px",
          'left': left + "px"
        });
      }

      // watch so we change the color when the value is changed externally
    	scope.$watch("myColor", function(newValue, oldValue) {
        scope.picker.css("background-color", scope.myColor);    	
    	 });
      
      // Find the current component along its range given position in palette
      function getComponent(component, col, row) {
        var axis = settings[component][2];
        var current = (axis == 'cols') ? col : row;
        var step = (settings[component][1] - settings[component][0]) / settings[axis];
        return parseInt((current * step) + settings[component][0]);
      }

      // build and compile the dynamic template
      var template = scope.buildTemplate();
      element.append($compile(template)(scope));

      // get reference to the pallete div as it will be made visible/invisible 
      scope.palette = angular.element(element.children().children()[1]);
      
      // bind click to the color picker div element
      // using [0] gets the raw DOM element. Wrapping it around angular.element() converts it to an angular element
      // with one, we have usual DOM methods provided by javascript, with the other, we get the angular methods 

      scope.picker = angular.element(element.children().children()[0]).children();
      scope.picker.bind('click', scope.toggle);
      
      // initialise the background color with the value passed into the scope
      scope.picker.css("background-color", scope.myColor);

      // calculate and set the pallete size
      scope.setPaletteSize();
      
      // call toggle to initialise the state of the color pallete element making it invisible
      scope.toggle();
      

    }
  };
});

app.directive('managecolor', function() {
  return {
    scope: {
      'myColor': '='
    },
    link: function(scope, element, attrs) {
      element.on('click', function() {
        scope.$apply(function() {
          scope.myColor = rgb2hex(element.css('background-color'));

          angular.element(element.parent().parent().children()[0]).children().css({
            "background-color": scope.myColor
          });

        });
      });

      function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
      }
    }
  }
});
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
app.directive("treeview", function(){
	return { restrict: "E",
			
			templateUrl: SiteParameters.theme_directory + '/js/partials/datatree-directive.html' 
	};
});



app.directive("nodeProperties", function($timeout) {
	return {
		link: function(scope, element, attr) {
			scope.dragDivStart = function(d) {
				console.log('drag start');
			}

			scope.dragDivMove = function(d) {
				var a = d3.select(this);
				a.style({
					right: (parseInt(a.style("right")) - parseInt(d3.event.dx)) + "px",
					top: d3.event.dy + parseInt(a.style("top")) + "px"
				});
			}

			scope.dragDiv = d3.behavior.drag()
				.origin(Object)
				.on("dragstart", scope.dragDivStart)
				.on("drag", scope.dragDivMove);

			d3.select('#' + attr.id).call(scope.dragDiv);

		},
		templateUrl: SiteParameters.theme_directory + '/js/partials/popup.html'
	};
});

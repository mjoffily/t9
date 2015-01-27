var canvas = new fabric.Canvas('c');
var groups = new Array();
var tops = 0;
var minWidth = 100;
var minHeight = 100;
var	padding = 10;
var data = [
   {
      "type":"unix server",
	  "top": true,
      "text":"itgsyddev255",
      "showas":"rectangle",
	  "fill" : "blue",
	  "width" : 0,
	  "height" : 0,
      "children":[]
   },
   {
      "type":"jBoss Application Server",
	  "top": true,
      "text":"wealth7-int1",
      "showas":"rectangle",
	  "fill" : "green",
	  "width" : 0,
	  "height" : 0,
      "children":[
         {
            "type":"application",
            "text":"samsara",
            "showas":"rectangle",
			"width" : 0,
			"height" : 0,
			"fill" : "red",
            "children":[
			  {
				"type":"application",
				"text":"samsariha",
				"showas":"circle",
				"width" : 0,
				"height" : 0,
				"fill" : "blue",
				"children":[]
			  }]
         },
         {
            "type":"application",
            "text":"datasynch",
            "showas":"rectangle",
			"width" : 0,
			"height" : 0,
			"fill" : "red",
            "children":[

            ]
         },
         {
            "type":"application",
            "text":"cashservices",
            "showas":"rectangle",
			"width" : 0,
			"height" : 0,
			"fill" : "red",
            "children":[

            ]
         }
      ]
   }
   ];


function draw(elems) {
	elems.forEach(function(elem) {
		sumWidth(elem, elem.children);
		sumHeight(elem, elem.children);
	});
	
	offset = 0;
	offsetTop = 0;
	elems.forEach(function(elem) {
		render(elem, offset, offsetTop);
		offset = offset + elem.width + padding;
	});
	
	
}

function render(parent, offset, offsetTop) {
	var text = new fabric.Text(parent.title, { fontSize:10, fill: 'black', left: offset });
	var poligon = renderPoligon(parent, offset, offsetTop);
	
	canvas.add(poligon);
	canvas.add(text);
	
	offsetTop = offsetTop + padding;
	parent.children.forEach(function(child) {
	    offset = offset + padding;
		render(child, offset, offsetTop);
	    offset = offset + child.width;
	});
     
}

function renderPoligon(elem, offset, offsetTop) {
    if (elem.showas == 'rectangle') {
		return new fabric.Rect({
						width: elem.width,
						height: elem.height,
						left: offset,
						top: offsetTop,
						fill: elem.fill});
	} else if (elem.showas == 'circle') {
		return new fabric.Circle({
						radius: elem.width / 2,
						left: offset,
						top: offsetTop,
						fill: elem.fill});
	}
}

function sumWidth(parent, children) {
	children.forEach(function(child) {
		if (child.children.length > 0) {
			sumWidth(child, child.children);
		}
		if (child.width < minWidth) {
			child.width = minWidth;
		}
		
		parent.width = parent.width + child.width + (padding * 2);
	});
	if (parent.width == 0) {
		parent.width = minWidth;
	}
}

function sumHeight(parent, children) {
	children.forEach(function(child) {
		if (child.children.length > 0) {
			sumHeight(child, child.children);
		}
		if (child.height < minHeight) {
			child.height = minHeight;
		}
		
		if (parent.height <= (child.height + (padding * 2))) {
			parent.height = child.height + (padding * 2);
		}
	});
	if (parent.height < minHeight) {
		parent.height = minHeight + padding * 2;
	}
}

function print(data, level) {
    level++;
	data.forEach(function(elem) { 
		console.log(level + ' ' + elem.title + ' ' + elem.width + ' height: ' + elem.height );
		print(elem.children, level);
	});
}
draw(data);
print(data, 0);

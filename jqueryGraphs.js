/**
 *  yAxis = {
 *   start,
 *   end,
 *   inc
 * }
 * xAxis = {
 *   start,
 *   end,
 *   labels,
 *   inc
 * }
 * 
 * options = {
 * 		rectangleWidth,
 * 		rectanglePadding,
 * 		color,
 * 		canvasWidth,
 * 		canvasHeight,
 * 		dataPrefix,
 * 		dataPostfix
 * }
 * 
 * 
 */

$.fn.jqueryGraphs = function (yDomain, xDomain, data, options) {

	
    //validating
    if (xDomain != null) {
        if (xDomain.end == undefined || xDomain.end == null) {
            throw new Error("Your parameter \"xDomain\" does not have the property \"end\".");
        }
    }

    if (yDomain != null) {
        if (xDomain.inc == 0 || xDomain.inc == undefined) {
            throw new Error("Your parameter property \"xDomain.inc\" cannot be zero or undefined: ");
        }
    }

    if (data.length != xDomain.end) {
        throw new Error("Your parameter \"data\" has eighter too many or not have enouch elements: ");
    }

    //default graph settings
    var rectWidth = 35;
    var recLeft = 55;    
    var recPadding = 5;
    var numberofElements = xDomain.end / xDomain.inc;
    var numberOfTicks = yDomain.end / yDomain.inc;
    var color = "red";
    var canvasWidth = 900;
    var canvasHeight = 1000;
    var maxRectangleHeight = 0;
    var maxRectangleWidth = data.length * 45;
    var fontSizeRatio;
    var fontSize = 10;
    var fontDerv = 10;
    var heightRatio = 1;
    var widthRatio = 1;
    var wOperand = "*";
    var operand = "*";
    var recLeftOperand = "-";
    
    //set option settings
    if (options != undefined || options != null) {
        if (options.rectangleWidth != undefined){
            rectWidth = options.rectangleWidth;
        }
        
        if (options.rectanglePadding != undefined){
            recPadding = options.rectanglePadding;
        }
        
        if (options.color != undefined){
            color = options.color;
        }
        
        if (options.canvasWidth != undefined){
            canvasWidth = options.canvasWidth;
        }
        
        if (options.canvasHeight != undefined){
            canvasHeight = options.canvasHeight;
        }
        
    }//end of outer if
    
    //calculate font sizes based on canvas area
    fontSizeRatio = (canvasWidth * canvasHeight) / (900 * 1000);
    fontSize =  fontSize + (8 * fontSizeRatio);
    fontDerv = (10 - fontSize) / fontSize;
    
    //calculate max height    
    for (var l = 0; l < data.length; l++) {
        if (data[l] > maxRectangleHeight) {
            maxRectangleHeight = data[l];
        }
    }
    //convert width and height to ordinal numbers
    
    if (canvasHeight > maxRectangleHeight){
    	heightRatio = (canvasHeight * .85) / maxRectangleHeight;
    } else {
    	operand = "/";
    	heightRatio = maxRectangleHeight / (canvasHeight * .85);
    }
    
    if (canvasWidth > maxRectangleWidth){
    	widthRatio = (canvasWidth * .85) / maxRectangleWidth;
    } else {
    	wOperand = "/";
    	recLeftOperand = "+";
    	widthRatio = maxRectangleWidth  / (canvasWidth * .85); 
    }

        
    var graphBottom = canvasHeight - 5;
    rectWidth = eval(rectWidth + wOperand + widthRatio);
    
    $(this).append("<svg id=\"svgCanvas\" width=\"" + canvasWidth + "\" height=\"" + canvasHeight + "\"></svg>");

    //the the x axis
    var lineH = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
        id: "lineHorizon",
        x1: recLeft - 20,
        y1: graphBottom - 15,
        x2: (numberofElements * (rectWidth + 10)) + (numberofElements *recPadding) + 10,
        y2: graphBottom - 15,
        style: "stroke:black;stroke-width:2"
    });

    $("#svgCanvas").append(lineH);
   
    //try to draw the graph
    recLeft = rectWidth + 15;
      
    try {
        for (var i = xDomain.start; i < numberofElements; i++) {
        	var dataHeight = "data[i]" +operand + heightRatio;
        	
            var bar = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
                id: "rec" + i,
                x: recLeft,
                y: graphBottom - 15,
                width: rectWidth,
                style: "stroke-width:2",
                rx:"8",
                ry:"8",
                height: eval(dataHeight),
                stroke: "black",
                fill: color,
                transform: "rotate(180," + (recLeft + 15) + "," + (graphBottom - 15) + ")",
                opacity: .75
            });

            var group = $(document.createElementNS("http://www.w3.org/2000/svg", "g")).attr({
                id: "g" + i
            });
           
            console.log(15 * fontSizeRatio);
            var mon = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + i,
                x: recLeft + (rectWidth * fontDerv) + (15 * fontSizeRatio),
                y: graphBottom - eval(dataHeight) - 25,
                fill: "black",
                style:"font-size:" + fontSize
            });

            if (xDomain.labels && xDomain.labels.length == data.length) {
                var lables = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                    id: "glabel" + i,
                    x: recLeft + (rectWidth * fontDerv) + (15 * fontSizeRatio),
                    y: graphBottom,
                    fill: "black",
                    style:"font-size:" + fontSize
                });
                lables.append(xDomain.labels[i]);
                $("#svgCanvas").append(lables);
            }//end of if

            	
            var prefix = (options != null && options.dataPrefix != undefined) ? options.dataPrefix : "";
            var postfix = (options != null && options.dataPostfix != undefined) ? options.dataPostfix : "";
            mon.append(prefix  + data[i] + postfix);
            recLeft = recLeft + rectWidth + recPadding;


            $("#svgCanvas").append(group);
            $("#g" + i).append(bar);
            $("#g" + i).append(mon);
            //$("#svgCanvas").append(mon);
        }//end of for
        
        
        //draw the y axis and the ticks
        recLeft = 35;
        
        var lineV = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
            id: "lineVerizon",
            x1: recLeft + 5,
            y1: graphBottom,
            x2: recLeft + 5,
            y2: 10,
            style: "stroke:black;stroke-width:2"
        });

        $("#svgCanvas").append(lineV);
        
        var tickBottom = graphBottom - 15;
        for (var j = yDomain.start; j <= numberOfTicks; j++) {
            var lineTick = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
                id: "lineTick",
                x1: recLeft + 2,
                y1: tickBottom,
                x2: recLeft + 8,
                y2: tickBottom,
                style: "stroke:black;stroke-width:1"
            });
            var tickNumber = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + j,
                x: recLeft - 15,
                y: tickBottom + 3,
                fill: "black",
                style:"font-size:" + fontSize
            });
            tickNumber.append(j * yDomain.inc);
            tickBottom = tickBottom - (yDomain.inc * heightRatio) ;
            $("#svgCanvas").append(lineTick);
            $("#svgCanvas").append(tickNumber);
        }




    } catch (e) {


    } //end of try/catch


};
$(function(){
	
	var yAxis = {
	    start: 0,
	    end: 75,
	    inc: 5
	};
	var xAxis = {
	    start: 0,
	    end: 5,
	    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
	    inc: 1
	};
	var myData = [25, 75, 50, 5, 31];

	var options = {canvasWidth:500,canvasHeight:500,dataPostfix:"%"};

	$("#drawBoard").jqueryGraphs(yAxis, xAxis, myData, options);
});
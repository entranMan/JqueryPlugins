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

$.fn.jqueryGraphs = function (parent, yDomain, xDomain, data, options) {


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
    var graphBottom = 185;
    var recPadding = 5;
    var numberofElements = xDomain.end / xDomain.inc;
    var numberOfTicks = yDomain.end / yDomain.inc;
    var color = "red";
    var canvasWidth = 900;
    var canvasHeight = 1000;
    var maxRectangleHeight = 0;


    for (var l = 0; l < data.length; l++) {
        if (data[l] > maxRectangleHeight) {
            maxRectangleHeight = data[l];
        }
    }

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
        
    }

    $(parent).append("<svg id=\"svgCanvas\" width=\"" + canvasWidth + "\" height=\"" + canvasHeight + "\"></svg>");


    var lineH = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
        id: "lineHorizon",
        x1: recLeft - 20,
        y1: graphBottom - 15,
        x2: numberofElements * (rectWidth + recPadding + 10),
        y2: graphBottom - 15,
        style: "stroke:black;stroke-width:2"
    });

    $("#svgCanvas").append(lineH);

    //try to draw the graph rectangles
    try {
        for (var i = xDomain.start; i < numberofElements; i++) {
            var bar = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
                id: "rec" + i,
                x: recLeft,
                y: graphBottom - 15,
                width: rectWidth,
                style: "stroke-width:2",
                height: data[i],
                stroke: "black",
                fill: color,
                transform: "rotate(180," + (recLeft + 15) + "," + (graphBottom - 15) + ")",
                opacity: .75
            });

            var group = $(document.createElementNS("http://www.w3.org/2000/svg", "g")).attr({
                id: "g" + i
            });


            var mon = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + i,
                x: recLeft + 5,
                y: graphBottom - data[i] - 25,
                fill: "black"
            });

            if (xDomain.labels && xDomain.labels.length == data.length) {
                var lables = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                    id: "glabel" + i,
                    x: recLeft + 2,
                    y: graphBottom,
                    fill: "black"
                });
                lables.append(xDomain.labels[i]);
                $("#svgCanvas").append(lables);
            }//end of if

            	
            var prefix = (options != null && options.dataPrefix != undefined) ? options.dataPrefix : "";
            var postfix = (options != null && options.dataPostfix != undefined) ? options.dataPostfix : "";
            mon.append(prefix  + data[i] + postfix);
            recLeft = recLeft + 35 + recPadding;


            $("#svgCanvas").append(group);
            $("#g" + i).append(bar);
            $("#svgCanvas").append(mon);
        }
        recLeft = 35;

        var lineV = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
            id: "lineVerizon",
            x1: recLeft + 5,
            y1: graphBottom,
            x2: recLeft + 5,
            y2: maxRectangleHeight + 10,
            style: "stroke:black;stroke-width:2"
        });

        $("#svgCanvas").append(lineV);
        //draw rectangle labels//
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
                fill: "black"
            });
            tickNumber.append(j * yDomain.inc);
            tickBottom = tickBottom - yDomain.inc;
            $("#svgCanvas").append(lineTick);
            $("#svgCanvas").append(tickNumber);
        }




    } catch (e) {


    } //end of try/catch


};
//example of how to use this plugin
var yAxis = {
    start: 0,
    end: 75,
    inc: 10
};
var xAxis = {
    start: 0,
    end: 5,
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    inc: 1
};
var myData = [25, 75, 50, 5, 31];

var options = {dataPostfix:"%"};

$("#drawBoard").jqueryGraphs($("#drawBoard"), yAxis, xAxis, myData, options);
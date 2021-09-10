function init() {
    var stage = new createjs.Stage("demoCanvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();
    // Initialize 4 points
    var radius = 10;
    var color = "rgba(46, 46, 213, 0.5)";
    var P1 = fillCircle(radius, windowWidth / 5, windowHeight / 5, color, stage);
    var P2 = fillCircle(radius, windowWidth / 5 * 2, windowHeight / 5 * 3, color, stage);
    var P3 = fillCircle(radius, windowWidth / 5 * 3, windowHeight / 5, color, stage);
    var P4 = fillCircle(radius, windowWidth / 5 * 4, windowHeight / 5 * 4, color, stage);
    // Draw lines between points
    var points = [P1, P2, P3, P4];
    var lines = new createjs.Shape();
    stage.addChild(lines);
    updateLines(points, lines, color, stage);
    // Draw the bezier
    var bezierRGBA = [255, 255, 255, 1];
    var bezierColor = 'rgba(${RGBA[0]}, ${RGBA[1]}, ${RGBA[2]}, ${RGBA[3]}';
    var bezier = new createjs.Shape();
    stage.addChild(bezier);
    updateBezier(points, bezier, bezierColor, stage);
    // Drag functionality
    points.forEach(function (item) {
        item.on("pressmove", function (evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points, bezier, bezierColor, stage);
            updateLines(points, lines, color, stage);
            stage.update();
        });
    });
    // Add points by button
    var addPointsButton = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', function (event) {
        addPoints(points, lines, bezier, color, bezierColor, stage, radius);
        stage.update();
    });
    // Change color by RGBA values
    var RGBAInput = [document.querySelector("#R"), document.querySelector("#G"), document.querySelector("#B"), document.querySelector("#Alpha")];
    for (var i = 0; i < 4; i++) {
        if (i < 3) {
            RGBAInput[i].value = "255";
        }
        else {
            RGBAInput[i].value = "1";
        }
    }
    var _loop_1 = function (i) {
        RGBAInput[i].addEventListener("input", function (event) {
            bezierRGBA[i] = parseFloat(RGBAInput[i].value);
            bezierColor = "rgba(" + bezierRGBA[0] + ", " + bezierRGBA[1] + ", " + bezierRGBA[2] + ", " + bezierRGBA[3];
            updateBezier(points, bezier, bezierColor, stage);
        });
    };
    for (var i = 0; i < 4; i++) {
        _loop_1(i);
    }
}
function fillCircle(radius, xPos, yPos, color, stage) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = xPos;
    circle.y = yPos;
    stage.addChild(circle);
    stage.update();
    return circle;
}
function updateBezier(points, bezier, bezierColor, stage) {
    bezier.graphics.clear();
    // Recursively draw bezier through using all points
    var bezierDraw = function (points, bezierColor) {
        var P1 = points[0];
        var P2 = points[1];
        var P3 = points[2];
        var P4 = points[3];
        // Draw bezier curve using first 4 points
        bezier.graphics.setStrokeStyle(2);
        bezier.graphics.beginStroke(bezierColor);
        bezier.graphics.moveTo(P1.x, P1.y);
        bezier.graphics.bezierCurveTo(P2.x, P2.y, P3.x, P3.y, P4.x, P4.y);
        bezier.graphics.endStroke();
        // Continue the curve with 3 more points after the first 4
        if (points.length >= 6) {
            var pointsSlice = points.slice(3, points.length);
            bezierDraw(pointsSlice, bezierColor);
        }
        stage.update();
    };
    bezierDraw(points, bezierColor);
}
function drawLine(P0, P1, line, color, stage) {
    // Draw lines between two points
    line.graphics.setStrokeStyle(2).beginStroke(color);
    line.graphics.moveTo(P0.x, P0.y);
    line.graphics.lineTo(P1.x, P1.y).endStroke();
    stage.update();
}
function updateLines(points, lines, color, stage) {
    // Iterate through points and connect with lines
    lines.graphics.clear();
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = points[i];
        var p1 = points[i + 1];
        drawLine(p0, p1, lines, color, stage);
    }
}
function addPoints(points, lines, bezier, color, bezierColor, stage, radius) {
    // Make new points in line with previous two points
    var prevTwoP = points.slice(-2);
    var delX = prevTwoP[1].x - prevTwoP[0].x;
    var delY = prevTwoP[1].y - prevTwoP[0].y;
    var magnitude = (Math.sqrt(Math.pow(delX, 2) + Math.pow(delY, 2))) * 0.02;
    delX = delX / magnitude;
    delY = delY / magnitude;
    // Ensure new points are within canvas
    var maxX = stage.canvas.width;
    var maxY = stage.canvas.height;
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY, maxY), 0), color, stage));
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX * 2, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 2, maxY), 0), color, stage));
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX * 3, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 3, maxY), 0), color, stage));
    updateBezier(points, bezier, bezierColor, stage);
    updateLines(points, lines, color, stage);
    stage.update();
    // Add drag functionality to new points
    points.slice(-3).forEach(function (item) {
        item.on("pressmove", function (evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points, bezier, bezierColor, stage);
            updateLines(points, lines, color, stage);
            stage.update();
        });
    });
    updateLines(points, lines, color, stage);
}

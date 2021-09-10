function init() {
    var stage = new createjs.Stage("demoCanvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();
    // Initialize 4 points
    var radius = 10;
    var P1 = fillCircle(radius, windowWidth / 5, windowHeight / 5, "rgba(55, 186, 219, 0.59)", stage);
    var P2 = fillCircle(radius, windowWidth / 5 * 2, windowHeight / 5 * 3, "rgba(55, 186, 219, 0.59)", stage);
    var P3 = fillCircle(radius, windowWidth / 5 * 3, windowHeight / 5, "rgba(55, 186, 219, 0.59)", stage);
    var P4 = fillCircle(radius, windowWidth / 5 * 4, windowHeight / 5 * 4, "rgba(55, 186, 219, 0.59)", stage);
    // Draw lines between points
    var points = [P1, P2, P3, P4];
    var lines = new createjs.Shape();
    stage.addChild(lines);
    updateLines(points, lines, stage);
    // Draw the bezier
    var bezier = new createjs.Shape();
    stage.addChild(bezier);
    updateBezier(points, bezier, stage);
    // Add points
    var addPointsButton = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', function (event) {
        addPoints(points, lines, bezier, stage, radius);
        stage.update();
    });
    // Drag functionality
    points.forEach(function (item) {
        item.on("pressmove", function (evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points, bezier, stage);
            updateLines(points, lines, stage);
            stage.update();
        });
    });
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
function updateBezier(points, bezier, stage) {
    bezier.graphics.clear();
    var bezierDraw = function (points, bezier, stage) {
        var P1 = points[0];
        var P2 = points[1];
        var P3 = points[2];
        var P4 = points[3];
        bezier.graphics.setStrokeStyle(2);
        bezier.graphics.beginStroke("#000000");
        bezier.graphics.moveTo(P1.x, P1.y);
        bezier.graphics.bezierCurveTo(P2.x, P2.y, P3.x, P3.y, P4.x, P4.y);
        bezier.graphics.endStroke();
        if (points.length >= 6) {
            var pointsSlice = points.slice(3, points.length);
            bezierDraw(pointsSlice, bezier, stage);
        }
        stage.update();
    };
    bezierDraw(points, bezier, stage);
}
function updateLine(P0, P1, line, stage) {
    line.graphics.setStrokeStyle(2).beginStroke("rgba(55, 186, 219, 0.59)");
    line.graphics.moveTo(P0.x, P0.y);
    line.graphics.lineTo(P1.x, P1.y).endStroke();
    stage.update();
}
function updateLines(points, lines, stage) {
    lines.graphics.clear();
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = points[i];
        var p1 = points[i + 1];
        updateLine(p0, p1, lines, stage);
    }
}
function addPoints(points, lines, bezier, stage, radius) {
    // Make new points in line with previous two points
    var prevTwoP = points.slice(-2);
    var delX = prevTwoP[1].x - prevTwoP[0].x;
    var delY = prevTwoP[1].y - prevTwoP[0].y;
    var magnitude = (Math.sqrt(Math.pow(delX, 2) + Math.pow(delY, 2))) * 0.02;
    delX = delX / magnitude;
    delY = delY / magnitude;
    var maxX = stage.canvas.width;
    var maxY = stage.canvas.height;
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY, maxY), 0), "rgba(55, 186, 219, 0.59)", stage));
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX * 2, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 2, maxY), 0), "rgba(55, 186, 219, 0.59)", stage));
    points.push(fillCircle(radius, Math.max(Math.min(prevTwoP[1].x + delX * 3, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 3, maxY), 0), "rgba(55, 186, 219, 0.59)", stage));
    updateBezier(points, bezier, stage);
    updateLines(points, lines, stage);
    stage.update();
    points.slice(-3).forEach(function (item) {
        item.on("pressmove", function (evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points, bezier, stage);
            updateLines(points, lines, stage);
            stage.update();
        });
    });
    updateLines(points, lines, stage);
}

function init() {
    var stage = new createjs.Stage("demoCanvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();
    // Initialize 4 points
    var radius = 10;
    var P1 = fillCircle(radius, windowWidth / 5, windowHeight / 5, "DeepSkyBlue", stage);
    var P2 = fillCircle(radius, windowWidth / 5 * 2, windowHeight / 5 * 3, "DeepSkyBlue", stage);
    var P3 = fillCircle(radius, windowWidth / 5 * 3, windowHeight / 5, "DeepSkyBlue", stage);
    var P4 = fillCircle(radius, windowWidth / 5 * 4, windowHeight / 5 * 4, "DeepSkyBlue", stage);
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
    var P1 = points[0];
    var P2 = points[1];
    var P3 = points[2];
    var P4 = points[3];
    bezier.graphics.clear();
    bezier.graphics.setStrokeStyle(2);
    bezier.graphics.beginStroke("#000000");
    bezier.graphics.moveTo(P1.x, P1.y);
    bezier.graphics.bezierCurveTo(P2.x, P2.y, P3.x, P3.y, P4.x, P4.y);
    bezier.graphics.endStroke();
    stage.update();
}
function updateLine(P0, P1, line, stage) {
    line.graphics.setStrokeStyle(2).beginStroke("#6f97d6");
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
    var lastPoint = points[points.length - 1];
    points.push(fillCircle(radius, 5, 5, "DeepSkyBlue", stage));
    points.push(fillCircle(radius, 7, 7, "DeepSkyBlue", stage));
    points.push(fillCircle(radius, 9, 9, "DeepSkyBlue", stage));
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

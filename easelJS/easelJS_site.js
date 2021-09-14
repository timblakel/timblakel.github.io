try {
    var easel = require("easeljs");
}
catch (error) {
    // Do this when for html (??)
}
function init() {
    var stage = new createjs.Stage("demoCanvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();
    var radius = 10;
    var pointColor = "rgba(46, 46, 213, 0.5)";
    // Initialize bezier
    var beziers = [new Bezier(stage, pointColor, radius, document)];
    var bezier0 = beziers[0];
    // Initialize bezier points
    var widthMultipliers = [1 / 5, 2 / 5, 3 / 5, 4 / 5];
    var heightMultipliers = [1 / 5, 2 / 5, 1 / 5, 2 / 5];
    for (var i = 0; i < 4; i++) {
        bezier0.getPoints.setShapes(i, fillCircle(bezier0.getPoints.getShapes[i], radius, windowWidth * widthMultipliers[i], windowHeight * heightMultipliers[i], pointColor, stage));
    }
    bezier0.updateBezier();
    // Add points by button
    var addPointsButton = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', function (event) {
        beziers.push(new Bezier(stage, pointColor, radius, document, beziers[beziers.length - 1]));
        beziers.forEach(function (bezier) {
            bezier.updateBezier();
            bezier.updateToggles();
        });
        stage.update();
    });
    // Toggle extra lines by button
    var extraLinesButton = document.querySelector("#extraLines");
    extraLinesButton.addEventListener('click', function (event) {
        beziers.forEach(function (bezier) {
            bezier.toggleLines();
        });
    });
    // Toggle extra points by button
    var t = 0;
    var extraPointsButton = document.querySelector("#extraPoints");
    extraPointsButton.addEventListener('click', function (event) {
        beziers.forEach(function (bezier) {
            bezier.togglePoints(t);
        });
    });
    // Animate lines and points to follow 't'
    var step = 0.003;
    createjs.Ticker.framerate = (24);
    createjs.Ticker.on("tick", function (tick) {
        beziers.forEach(function (bezier) {
            bezier.updateAllInterpoints(t);
            bezier.updateAllLines();
        });
        t = (t + step) % 1;
    });
}
// Create bezier class
// Will hold bezier curve, lines, points, etc
var Bezier = /** @class */ (function () {
    function Bezier(stage, pointColor, pointRadius, document, prevBezier) {
        var _this = this;
        this.stage = stage;
        this.prevBezier = prevBezier;
        this.curve = new createjs.Shape();
        this.lines = new createjs.Shape();
        this.lines1 = new createjs.Shape();
        this.lines2 = new createjs.Shape();
        this.linesToggle = true;
        this.pointsToggle = 0;
        // Assign main points
        if (prevBezier == undefined) {
            // If first bezier curve, just create the shape objects
            this.points = new Points(4, pointColor, pointRadius, []);
        }
        else {
            // New bezier's first point will be previous beziers last point
            // Get information from previous curve and assign appropiately
            this.linesToggle = prevBezier.getLineToggle;
            var prevShapes = prevBezier.getPoints.getShapes;
            // Get previous bezier's point toggle
            this.pointsToggle = prevBezier.pointsToggle;
            // Let first point be the last of point of the previous curve
            this.points = new Points(4, pointColor, pointRadius, [prevShapes[prevShapes.length - 1]]);
            // Do some math to make new points in line with previous two points for
            var prevTwoP = prevBezier.getPoints.getShapes.slice(-2);
            var delX = prevTwoP[1].x - prevTwoP[0].x;
            var delY = prevTwoP[1].y - prevTwoP[0].y;
            var magnitude = (Math.sqrt(Math.pow(delX, 2) + Math.pow(delY, 2))) * 0.02;
            delX = delX / magnitude;
            delY = delY / magnitude;
            // Ensure new points are within canvas
            var maxX = stage.canvas.width;
            var maxY = stage.canvas.height;
            // Assign last three points
            this.points.setShapes(1, fillCircle(this.points.getShapes[1], pointRadius, Math.max(Math.min(prevTwoP[1].x + delX, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY, maxY), 0), pointColor, stage));
            this.points.setShapes(2, fillCircle(this.points.getShapes[2], pointRadius, Math.max(Math.min(prevTwoP[1].x + delX * 2, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 2, maxY), 0), pointColor, stage));
            this.points.setShapes(3, fillCircle(this.points.getShapes[3], pointRadius, Math.max(Math.min(prevTwoP[1].x + delX * 3, maxX), 0), Math.max(Math.min(prevTwoP[1].y + delY * 3, maxY), 0), pointColor, stage));
        }
        // Assign points1
        this.points1 = new Points(3, this.points.getColor, this.points.getRadius / 2, []);
        this.points1 = updateInterpoints(this.points, this.points1, 0, this.stage);
        // assign points2
        this.points2 = new Points(2, this.points1.getColor, this.points1.getRadius, []);
        this.points2 = updateInterpoints(this.points1, this.points2, 0, this.stage);
        // assign points 3
        this.points3 = new Points(1, "rgba(250, 20, 20, 0.5", this.points2.getRadius, []);
        this.points3 = updateInterpoints(this.points2, this.points3, 0, this.stage);
        // Add shapes to stage
        stage.addChild(this.curve);
        stage.addChild(this.lines);
        stage.addChild(this.lines1);
        stage.addChild(this.lines2);
        this.points.getShapes.forEach(function (point) {
            stage.addChild(point);
        });
        this.points1.getShapes.forEach(function (point) {
            stage.addChild(point);
        });
        this.points2.getShapes.forEach(function (point) {
            stage.addChild(point);
        });
        this.points3.getShapes.forEach(function (point) {
            stage.addChild(point);
        });
        // Enable dragging functionality
        this.pointDrag(stage);
        // Curve RBGA input functionality 
        this.RGBAInput = [document.querySelector("#R"), document.querySelector("#G"), document.querySelector("#B"), document.querySelector("#Alpha")];
        // Set default color
        for (var i = 0; i < 4; i++) {
            if (i < 3) {
                this.RGBAInput[i].value = "0";
            }
            else {
                this.RGBAInput[i].value = "1";
            }
        }
        // Detect RGBA input change to update color
        for (var i = 0; i < 4; i++) {
            this.RGBAInput[i].addEventListener("input", function (event) {
                _this.updateBezier();
            });
        }
        this.updateBezier();
    }
    Object.defineProperty(Bezier.prototype, "getPoints", {
        get: function () {
            return this.points;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bezier.prototype, "getLineToggle", {
        get: function () {
            return this.linesToggle;
        },
        enumerable: false,
        configurable: true
    });
    // update curve and lines
    Bezier.prototype.updateBezier = function () {
        var stage = this.stage;
        this.curve.graphics.clear();
        var bezierRGBA = [0, 0, 0, 1];
        for (var i = 0; i < 4; i++) {
            if (i < 3) {
                bezierRGBA[i] = Math.min(Math.max(parseFloat(this.RGBAInput[i].value), 0), 255);
            }
            else {
                bezierRGBA[i] = Math.min(Math.max(parseFloat(this.RGBAInput[i].value), 0), 1);
            }
        }
        var curveColor = "rgba(" + bezierRGBA[0] + ", " + bezierRGBA[1] + ", " + bezierRGBA[2] + ", " + bezierRGBA[3] + ")";
        // Draw bezier through using all points
        var bezierDraw = function (bezier, curveColor) {
            var points = bezier.getPoints.getShapes;
            var P1 = points[0];
            var P2 = points[1];
            var P3 = points[2];
            var P4 = points[3];
            // Draw bezier curve using first 4 points
            bezier.curve.graphics.setStrokeStyle(2);
            bezier.curve.graphics.beginStroke(curveColor);
            bezier.curve.graphics.moveTo(P1.x, P1.y);
            bezier.curve.graphics.bezierCurveTo(P2.x, P2.y, P3.x, P3.y, P4.x, P4.y);
            bezier.curve.graphics.endStroke();
        };
        bezierDraw(this, curveColor);
        this.updateAllLines();
        this.updateToggles();
        stage.update();
    };
    // Point drag functionality
    Bezier.prototype.pointDrag = function (stage) {
        var bezier = this;
        this.points.getShapes.forEach(function (item) {
            item.on("pressmove", function (evt) {
                item.x = evt.stageX;
                item.y = evt.stageY;
                bezier.updateBezier();
                bezier.updateAllLines();
                stage.update();
            });
        });
    };
    Bezier.prototype.updateAllLines = function () {
        this.updateLines(this.lines, this.points);
        this.updateLines(this.lines1, this.points1);
        this.updateLines(this.lines2, this.points2);
        this.stage.update();
    };
    // update position and color of lines between n points
    Bezier.prototype.updateLines = function (lines, pointsObj) {
        var stage = this.stage;
        // Iterate through points and connect with lines
        var toggle = this.linesToggle;
        var pShapes = pointsObj.getShapes;
        var color;
        if (toggle) {
            color = this.points.getColor;
        }
        else {
            color = "rgba(0,0,0,0)";
        }
        lines.graphics.clear();
        for (var i = 0; i < pShapes.length - 1; i++) {
            var p0 = pShapes[i];
            var p1 = pShapes[i + 1];
            drawLine(p0, p1, lines, color, stage);
        }
    };
    // Turn lines on/off
    Bezier.prototype.toggleLines = function () {
        this.linesToggle = !this.linesToggle;
        this.updateAllLines();
    };
    // Change toggle value and update points on/off values
    Bezier.prototype.togglePoints = function (t) {
        this.pointsToggle = (this.pointsToggle + 1) % 4;
        this.updateToggles();
        this.updateAllInterpoints(t);
    };
    // Use current toggle value to turn points on/off
    Bezier.prototype.updateToggles = function () {
        switch (this.pointsToggle) {
            case 0:
                this.points1.toggle(true);
                this.points2.toggle(true);
                this.points3.toggle(true);
                break;
            case 1:
                this.points1.toggle(true);
                this.points2.toggle(false);
                this.points3.toggle(true);
                break;
            case 2:
                this.points1.toggle(false);
                this.points2.toggle(false);
                break;
            case 3:
                this.points1.toggle(false);
                this.points2.toggle(false);
                this.points3.toggle(false);
                break;
        }
    };
    // Update and positions
    Bezier.prototype.updateAllInterpoints = function (t) {
        updateInterpoints(this.points, this.points1, t, this.stage);
        updateInterpoints(this.points1, this.points2, t, this.stage);
        updateInterpoints(this.points2, this.points3, t, this.stage);
    };
    return Bezier;
}());
var Points = /** @class */ (function () {
    function Points(numPoints, color, radius, existingPoints) {
        this.color = color;
        this.defaultColor = color;
        this.radius = radius;
        this.shapes = [];
        for (var i = 0; i < existingPoints.length; i++) {
            this.shapes.push(existingPoints[i]);
        }
        for (var i = this.shapes.length; i < numPoints; i++) {
            this.shapes.push(new createjs.Shape());
        }
    }
    Object.defineProperty(Points.prototype, "getColor", {
        get: function () {
            return this.color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Points.prototype, "getRadius", {
        get: function () {
            return this.radius;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Points.prototype, "getShapes", {
        get: function () {
            return this.shapes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Points.prototype, "getDColor", {
        get: function () {
            return this.defaultColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Points.prototype, "getToggle", {
        get: function () {
            return this.isOn;
        },
        enumerable: false,
        configurable: true
    });
    Points.prototype.setShapes = function (index, shape) {
        this.shapes[index] = shape;
    };
    Points.prototype.toggle = function (onOff) {
        this.isOn = onOff;
        if (this.isOn) {
            this.color = this.defaultColor;
        }
        else {
            this.color = "rgba(0,0,0,0)";
        }
    };
    return Points;
}());
// create point
function fillCircle(circle, radius, xPos, yPos, color, stage) {
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = xPos;
    circle.y = yPos;
    stage.update();
    return circle;
}
// draw line between two points
function drawLine(P0, P1, line, color, stage) {
    line.graphics.setStrokeStyle(2).beginStroke(color);
    line.graphics.moveTo(P0.x, P0.y);
    line.graphics.lineTo(P1.x, P1.y).endStroke();
    stage.update();
}
// Take points and interpoints, place interpoints on lines connecting points
// t represents progress from one end of line to the other
function updateInterpoints(points, interpoints, t, stage) {
    var pShapes = points.getShapes;
    var iShapes = interpoints.getShapes;
    iShapes.forEach(function (shape) {
        shape.graphics.clear();
    });
    for (var i = 0; i < points.getShapes.length - 1; i++) {
        var xPos = (pShapes[i + 1].x - pShapes[i].x) * t + pShapes[i].x;
        var yPos = (pShapes[i + 1].y - pShapes[i].y) * t + pShapes[i].y;
        interpoints.setShapes(i, fillCircle(iShapes[i], interpoints.getRadius, xPos, yPos, interpoints.getColor, stage));
    }
    stage.update();
    return interpoints;
}

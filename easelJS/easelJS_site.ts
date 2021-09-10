declare const createjs: any;

function init(){
    
    let stage: any = new createjs.Stage("demoCanvas");
    let windowWidth: number = window.innerWidth;
    let windowHeight: number = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();
    
    // Initialize 4 points
    let radius: number = 10;
    let P1 = fillCircle(radius,windowWidth/5,windowHeight/5,"rgba(46, 46, 213, 0.66)",stage);
    let P2 = fillCircle(radius,windowWidth/5*2,windowHeight/5*3,"rgba(46, 46, 213, 0.66)",stage);
    let P3 = fillCircle(radius,windowWidth/5*3,windowHeight/5,"rgba(46, 46, 213, 0.66)",stage);
    let P4 = fillCircle(radius,windowWidth/5*4,windowHeight/5*4,"rgba(46, 46, 213, 0.66)",stage);

    // Draw lines between points
    let points = [P1, P2, P3, P4];
    let lines = new createjs.Shape();
    stage.addChild(lines);
    updateLines(points,lines,stage);

    // Draw the bezier
    let bezier: any = new createjs.Shape();
    stage.addChild(bezier);
    updateBezier(points,bezier,stage);

    // Add points
    let addPointsButton: any = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', event => {
        addPoints(points,lines,bezier,stage,radius);
        stage.update();
    })

    // Drag functionality
    points.forEach(item => {
        item.on("pressmove", function(evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points,bezier,stage);
            updateLines(points,lines,stage);
            stage.update();
        })
    })
}

function fillCircle(radius: number,xPos: number,yPos: number,color: string,stage) {
    let circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0,0,radius);
    circle.x = xPos; circle.y = yPos;
    stage.addChild(circle);
    stage.update();
    return circle;
}

function updateBezier(points,bezier,stage) {
    bezier.graphics.clear();

    let bezierDraw = function (points,bezier,stage) {
        let P1 = points[0];
        let P2 = points[1];
        let P3 = points[2];
        let P4 = points[3];

        bezier.graphics.setStrokeStyle(2);
        bezier.graphics.beginStroke("#000000");
        bezier.graphics.moveTo(P1.x,P1.y);
        bezier.graphics.bezierCurveTo(P2.x,P2.y,P3.x,P3.y,P4.x,P4.y);
        bezier.graphics.endStroke();

        if (points.length >= 6) {
            let pointsSlice = points.slice(3,points.length);
            bezierDraw(pointsSlice,bezier,stage);
        }

        stage.update();
    }
    bezierDraw(points, bezier, stage);
}

function updateLine(P0,P1,line,stage) {
    line.graphics.setStrokeStyle(2).beginStroke("rgba(46, 46, 213, 0.66)");
    line.graphics.moveTo(P0.x,P0.y);
    line.graphics.lineTo(P1.x,P1.y).endStroke();
    stage.update();
}

function updateLines(points,lines,stage) {
    lines.graphics.clear();
    for (let i = 0; i < points.length - 1; i++) {
        let p0 = points[i];
        let p1 = points[i+1];
        updateLine(p0,p1,lines,stage);
    }
}

function addPoints(points,lines,bezier,stage,radius) {
    // Make new points in line with previous two points
    let prevTwoP = points.slice(-2);
    let delX = prevTwoP[1].x - prevTwoP[0].x;
    let delY = prevTwoP[1].y - prevTwoP[0].y;
    let magnitude = (Math.sqrt(Math.pow(delX,2) + Math.pow(delY,2))) * 0.02;
    delX = delX / magnitude;
    delY = delY / magnitude;
    
    let maxX = stage.canvas.width;
    let maxY = stage.canvas.height;

    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY,maxY),0),"rgba(46, 46, 213, 0.66)",stage));
    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX*2,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY*2,maxY),0),"rgba(46, 46, 213, 0.66)",stage));
    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX*3,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY*3,maxY),0),"rgba(46, 46, 213, 0.66)",stage));

    updateBezier(points,bezier,stage);
    updateLines(points,lines,stage);
    stage.update();

    points.slice(-3).forEach(item => {
        item.on("pressmove", function(evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points,bezier,stage);
            updateLines(points,lines,stage);
            stage.update();
        })
    })

    updateLines(points,lines,stage);
}
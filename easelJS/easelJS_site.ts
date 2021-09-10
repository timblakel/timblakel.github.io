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
    let color: string = "rgba(46, 46, 213, 0.5)";
    let P1 = fillCircle(radius,windowWidth/5,windowHeight/5,color,stage);
    let P2 = fillCircle(radius,windowWidth/5*2,windowHeight/5*3,color,stage);
    let P3 = fillCircle(radius,windowWidth/5*3,windowHeight/5,color,stage);
    let P4 = fillCircle(radius,windowWidth/5*4,windowHeight/5*4,color,stage);

    // Draw lines between points
    let points = [P1, P2, P3, P4];
    let lines = new createjs.Shape();
    stage.addChild(lines);
    updateLines(points,lines,color,stage);

    // Draw the bezier
    let bezierRGBA: number[] = [255, 255, 255, 1];
    let bezierColor: string = 'rgba(${RGBA[0]}, ${RGBA[1]}, ${RGBA[2]}, ${RGBA[3]}';
    let bezier: any = new createjs.Shape();
    stage.addChild(bezier);
    updateBezier(points,bezier,bezierColor,stage);

    // Drag functionality
    points.forEach(item => {
        item.on("pressmove", function(evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points,bezier,bezierColor,stage);
            updateLines(points,lines,color,stage);
            stage.update();
        })
    })

    // Add points by button
    let addPointsButton: any = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', event => {
        addPoints(points,lines,bezier,color,bezierColor,stage,radius);
        stage.update();
    })

    // Change color by RGBA values
    let RGBAInput: HTMLInputElement[] = [document.querySelector("#R"), document.querySelector("#G"), document.querySelector("#B"), document.querySelector("#Alpha")]
    for (let i = 0; i < 4; i++) {
        if (i<3) {
            RGBAInput[i].value = "255";
        } else {
            RGBAInput[i].value = "1";
        }
    }

    for (let i = 0; i < 4; i++) {
        RGBAInput[i].addEventListener("input", event => {
            bezierRGBA[i] = parseFloat(RGBAInput[i].value,);
            bezierColor = `rgba(${bezierRGBA[0]}, ${bezierRGBA[1]}, ${bezierRGBA[2]}, ${bezierRGBA[3]}`;
            updateBezier(points,bezier,bezierColor,stage);
        })
    }
}

function fillCircle(radius: number,xPos: number,yPos: number,color: string,stage) {
    let circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0,0,radius);
    circle.x = xPos; circle.y = yPos;
    stage.addChild(circle);
    stage.update();
    return circle;
}

function updateBezier(points,bezier,bezierColor: string,stage) {
    bezier.graphics.clear();

    // Recursively draw bezier through using all points
    let bezierDraw = function (points,bezierColor) {
        let P1 = points[0];
        let P2 = points[1];
        let P3 = points[2];
        let P4 = points[3];

        // Draw bezier curve using first 4 points
        bezier.graphics.setStrokeStyle(2);
        bezier.graphics.beginStroke(bezierColor);
        bezier.graphics.moveTo(P1.x,P1.y);
        bezier.graphics.bezierCurveTo(P2.x,P2.y,P3.x,P3.y,P4.x,P4.y);
        bezier.graphics.endStroke();

        // Continue the curve with 3 more points after the first 4
        if (points.length >= 6) {
            let pointsSlice = points.slice(3,points.length);
            bezierDraw(pointsSlice,bezierColor);
        }
        stage.update();
    }
    bezierDraw(points,bezierColor);
}

function drawLine(P0,P1,line,color: string,stage) {
    // Draw lines between two points
    line.graphics.setStrokeStyle(2).beginStroke(color);
    line.graphics.moveTo(P0.x,P0.y);
    line.graphics.lineTo(P1.x,P1.y).endStroke();
    stage.update();
}

function updateLines(points,lines,color,stage) {
    // Iterate through points and connect with lines
    lines.graphics.clear();
    for (let i = 0; i < points.length - 1; i++) {
        let p0 = points[i];
        let p1 = points[i+1];
        drawLine(p0,p1,lines,color,stage);
    }
}

function addPoints(points,lines,bezier,color,bezierColor,stage,radius) {
    // Make new points in line with previous two points
    let prevTwoP = points.slice(-2);
    let delX = prevTwoP[1].x - prevTwoP[0].x;
    let delY = prevTwoP[1].y - prevTwoP[0].y;
    let magnitude = (Math.sqrt(Math.pow(delX,2) + Math.pow(delY,2))) * 0.02;
    delX = delX / magnitude;
    delY = delY / magnitude;
    
    // Ensure new points are within canvas
    let maxX = stage.canvas.width;
    let maxY = stage.canvas.height;

    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY,maxY),0),color,stage));
    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX*2,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY*2,maxY),0),color,stage));
    points.push(fillCircle(radius,Math.max(Math.min(prevTwoP[1].x+delX*3,maxX),0),Math.max(Math.min(prevTwoP[1].y+delY*3,maxY),0),color,stage));

    updateBezier(points,bezier,bezierColor,stage);
    updateLines(points,lines,color,stage);
    stage.update();

    // Add drag functionality to new points
    points.slice(-3).forEach(item => {
        item.on("pressmove", function(evt) {
            item.x = evt.stageX;
            item.y = evt.stageY;
            updateBezier(points,bezier,bezierColor,stage);
            updateLines(points,lines,color,stage);
            stage.update();
        })
    })

    updateLines(points,lines,color,stage);
}
declare const createjs: any;

function init(){
    
    let stage = new createjs.Stage("demoCanvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    stage.canvas.height =windowHeight;
    stage.canvas.width = windowWidth;
    stage.update();
    
    let radius: number = 10;
    let P1 = fillCircle(radius,windowWidth/5,windowHeight/5,"DeepSkyBlue",stage);
    let P2 = fillCircle(radius,windowWidth/5*2,windowHeight/5*3,"DeepSkyBlue",stage);
    let P3 = fillCircle(radius,windowWidth/5*3,windowHeight/5,"DeepSkyBlue",stage);
    let P4 = fillCircle(radius,windowWidth/5*4,windowHeight/5*4,"DeepSkyBlue",stage);

    let points = [P1, P2, P3, P4];
    let lines = new createjs.Shape();
    stage.addChild(lines);
    updateLines(points,lines,stage);

    let bezier = new createjs.Shape();
    stage.addChild(bezier);
    updateBezier(points,bezier,stage);

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
    let P1 = points[0];
    let P2 = points[1];
    let P3 = points[2];
    let P4 = points[3];
    bezier.graphics.clear();

    bezier.graphics.setStrokeStyle(2);
    bezier.graphics.beginStroke("#000000");
    bezier.graphics.moveTo(P1.x,P1.y);
    bezier.graphics.bezierCurveTo(P2.x,P2.y,P3.x,P3.y,P4.x,P4.y);
    bezier.graphics.endStroke();

    stage.update();
}

function updateLine(P0,P1,line,stage) {
    line.graphics.setStrokeStyle(2).beginStroke("#6f97d6");
    line.graphics.moveTo(P0.x,P0.y);
    line.graphics.lineTo(P1.x,P1.y).endStroke();
    stage.update();
}

function updateLines(points,lines,stage) {
    lines.graphics.clear();
    for (let i = 0; i < 3; i++) {
        let p0 = points[i];
        let p1 = points[i+1];
        updateLine(p0,p1,lines,stage);
    }
}
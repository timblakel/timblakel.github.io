try {
    var easel = require("easeljs");
} catch (error) {
    // Do this when for html (??)
}


function init(){
    
    let stage: any = new createjs.Stage("demoCanvas");
    let windowWidth: number = window.innerWidth;
    let windowHeight: number = window.innerHeight;
    stage.canvas.height = windowHeight - 20;
    stage.canvas.width = windowWidth - 40;
    stage.update();

    let radius: number = 10;
    let pointColor: string = "rgba(46, 46, 213, 0.5)";

    // Initialize bezier
    let beziers: Bezier[] = [new Bezier(stage, pointColor, radius, document)];
    let bezier0: Bezier = beziers[0];

    // Initialize bezier points
    let widthMultipliers: number[] = [3/10, 3/10, 3/5, 7/10];
    let heightMultipliers: number[] = [3/6, 3/12, 1/6, 4/6];
    for (let i = 0; i < 4; i++) {
        bezier0.getPoints.setShapes(i, fillCircle(bezier0.getPoints.getShapes[i], radius, 
            windowWidth*widthMultipliers[i], windowHeight*heightMultipliers[i], 
            pointColor, stage));
    }
    bezier0.updateBezier();

    // Add points by button
    let addPointsButton: HTMLInputElement = document.querySelector("#addPoints");
    addPointsButton.addEventListener('click', event => {
        beziers.push(new Bezier(stage, pointColor, radius, document, beziers[beziers.length-1]));
        beziers.forEach(bezier => {
            bezier.updateBezier();
        })
        stage.update();
    })

    // Toggle extra lines by button
    let extraLinesButton: HTMLInputElement = document.querySelector("#extraLines");
    extraLinesButton.addEventListener('click', event => {
        beziers.forEach(bezier => {
            bezier.toggleLines();
        })
    })

    // Toggle extra points by button
    let t = 0;
    let extraPointsButton: HTMLInputElement = document.querySelector("#extraPoints");
    extraPointsButton.addEventListener('click', event => {
        beziers.forEach(bezier => {
            bezier.togglePoints(t);
        })
    })

    // Animate lines and points to follow 't'
    let step: number = 0.003*2.5;
    createjs.Ticker.framerate = (10);
    createjs.Ticker.on("tick", tick => {
        beziers.forEach(bezier => {
            bezier.updateAllInterpoints(t);                    
            bezier.updateAllLines();
        })
        t = (t + step) % 1;
    });
    
}

// Create bezier class
// Will hold bezier curve, lines, points, etc
class Bezier {
    stage: createjs.Stage;
    curve: createjs.Shape;
    lines: createjs.Shape;
    lines1: createjs.Shape;
    lines2: createjs.Shape;
    linesToggle: boolean;
    points: Points; // endpoints and handles
    points1: Points; // follows line between main points
    points2: Points; // follows line between points1
    points3: Points; // point that follows curve
    pointsToggle: number;
    curveColor: string;
    RGBAInput: HTMLInputElement[];
    prevBezier: Bezier;

    constructor(stage: any, pointColor:string, pointRadius: number, document: Document, prevBezier?: Bezier) {
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
            this.points = new Points(4,pointColor, pointRadius, []);
        } else {
            // New bezier's first point will be previous beziers last point
            // Get information from previous curve and assign appropiately
            this.linesToggle = prevBezier.getLineToggle;
            let prevShapes: createjs.Shape[] = prevBezier.getPoints.getShapes;

            // Get previous bezier's point toggle
            this.pointsToggle = prevBezier.pointsToggle;

            // Let first point be the last of point of the previous curve
            this.points = new Points(4,pointColor, pointRadius, [prevShapes[prevShapes.length-1]]);

            // Do some math to make new points in line with previous two points for
            let prevTwoP = prevBezier.getPoints.getShapes.slice(-2);
            let delX: number = prevTwoP[1].x - prevTwoP[0].x;
            let delY: number = prevTwoP[1].y - prevTwoP[0].y;
            let magnitude: number = (Math.sqrt(Math.pow(delX,2) + Math.pow(delY,2))) * 0.02;
            delX = delX / magnitude;
            delY = delY / magnitude;

            // Ensure new points are within canvas
            let maxX: number = stage.canvas.width;
            let maxY: number = stage.canvas.height;

            // Assign last three points
            this.points.setShapes(1,fillCircle(this.points.getShapes[1],pointRadius,
                Math.max(Math.min(prevTwoP[1].x+delX,maxX),0),
                Math.max(Math.min(prevTwoP[1].y+delY,maxY),0),
                pointColor,stage));
            this.points.setShapes(2,fillCircle(this.points.getShapes[2],pointRadius,
                Math.max(Math.min(prevTwoP[1].x+delX*2,maxX),0),
                Math.max(Math.min(prevTwoP[1].y+delY*2,maxY),0),
                pointColor,stage));
            this.points.setShapes(3,fillCircle(this.points.getShapes[3],pointRadius,
                Math.max(Math.min(prevTwoP[1].x+delX*3,maxX),0),
                Math.max(Math.min(prevTwoP[1].y+delY*3,maxY),0),
                pointColor,stage));
        }

        // Assign points1
        this.points1 = new Points(3,this.points.getColor,this.points.getRadius/2,[]);
        this.points1 = updateInterpoints(this.points,this.points1,0,this.stage);

        // assign points2
        this.points2 = new Points(2,this.points1.getColor,this.points1.getRadius,[]);
        this.points2 = updateInterpoints(this.points1,this.points2,0,this.stage);

        // assign points 3
        this.points3 = new Points(1,"rgba(250, 20, 20, 0.5",this.points2.getRadius,[]);
        this.points3 = updateInterpoints(this.points2,this.points3,0,this.stage);

        // Add shapes to stage
        stage.addChild(this.curve);
        stage.addChild(this.lines);
        stage.addChild(this.lines1);
        stage.addChild(this.lines2);
        this.points.getShapes.forEach(point => {
            stage.addChild(point);
        });
        this.points1.getShapes.forEach(point => {
            stage.addChild(point);
        })
        this.points2.getShapes.forEach(point => {
            stage.addChild(point);
        })
        this.points3.getShapes.forEach(point => {
            stage.addChild(point);
        })

        // Enable dragging functionality
        this.pointDrag(stage);

        // Curve RBGA input functionality 
        this.RGBAInput = [document.querySelector("#R"), document.querySelector("#G"), document.querySelector("#B"), document.querySelector("#Alpha")];
        // Set default color
        for (let i = 0; i < 4; i++) {
            if (i<3) {
                this.RGBAInput[i].value = "0";
            } else {
                this.RGBAInput[i].value = "1";
            }
        }
        // Detect RGBA input change to update color
        for (let i = 0; i < 4; i++) {
            this.RGBAInput[i].addEventListener("input", event => {
                this.updateBezier();
            })
        }

        this.updateBezier();
    }

    public get getPoints() {
        return this.points;
    }

    public get getLineToggle() {
        return this.linesToggle;
    }
    
    // update curve and lines
    updateBezier(): void {
        let stage: createjs.Stage = this.stage;
        this.curve.graphics.clear();
    
        let bezierRGBA: number[] = [0, 0, 0, 1];
        for (let i = 0; i < 4; i++) {
            if (i < 3) {
                bezierRGBA[i] = Math.min(Math.max(parseFloat(this.RGBAInput[i].value),0),255);
            } else {
                bezierRGBA[i] = Math.min(Math.max(parseFloat(this.RGBAInput[i].value),0),1);
            }
        }
        let curveColor: string = `rgba(${bezierRGBA[0]}, ${bezierRGBA[1]}, ${bezierRGBA[2]}, ${bezierRGBA[3]})`;
    
        // Draw bezier through using all points
        let bezierDraw = function (bezier: Bezier,curveColor: string) {
            let points: createjs.Shape[] = bezier.getPoints.getShapes;
            let P1 = points[0];
            let P2 = points[1];
            let P3 = points[2];
            let P4 = points[3];
    
            // Draw bezier curve using first 4 points
            bezier.curve.graphics.setStrokeStyle(2);
            bezier.curve.graphics.beginStroke(curveColor);
            bezier.curve.graphics.moveTo(P1.x,P1.y);
            bezier.curve.graphics.bezierCurveTo(P2.x,P2.y,P3.x,P3.y,P4.x,P4.y);
            bezier.curve.graphics.endStroke();
        }
        bezierDraw(this,curveColor);

        this.updateAllLines();
        this.updateToggles();
        stage.update();
    }

    // Point drag functionality
    pointDrag(stage: createjs.Stage): void {
        let bezier: Bezier = this;
        this.points.getShapes.forEach(item => {
            item.on("pressmove", function(evt: any) {
                item.x = evt.stageX;
                item.y = evt.stageY;
                bezier.updateBezier();
                bezier.updateAllLines();
                stage.update();
            })
        })
    }

    updateAllLines() {
        this.updateLines(this.lines,this.points);
        this.updateLines(this.lines1,this.points1);
        this.updateLines(this.lines2,this.points2);
        this.stage.update();
    }
    // update position and color of lines between n points
    updateLines(lines: createjs.Shape,pointsObj: Points) {
        let stage: createjs.Stage = this.stage;
        // Iterate through points and connect with lines
        let toggle: boolean = this.linesToggle;
        let pShapes: createjs.Shape[] = pointsObj.getShapes;
        let color: string;

        if (toggle) {
            color = this.points.getColor;
        } else {
            color = "rgba(0,0,0,0)"
        }

        lines.graphics.clear();
        for (let i = 0; i < pShapes.length - 1; i++) {
            let p0 = pShapes[i];
            let p1 = pShapes[i+1];
            drawLine(p0,p1,lines,color,stage);
        }
    }

    // Turn lines on/off
    toggleLines(): void {
        this.linesToggle = !this.linesToggle;
        this.updateAllLines();
    }

    // Change toggle value and update points on/off values
    togglePoints(t: number): void {
        this.pointsToggle = (this.pointsToggle + 1) % 4;
        this.updateToggles();
        this.updateAllInterpoints(t);
    }

    // Use current toggle value to turn points on/off
    updateToggles(): void {
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
    }

    // Update and positions
    updateAllInterpoints(t: number): void {        
        updateInterpoints(this.points,this.points1,t,this.stage);
        updateInterpoints(this.points1,this.points2,t,this.stage);
        updateInterpoints(this.points2,this.points3,t,this.stage);        
    }
}

class Points {
    shapes: createjs.Shape[];
    color: string;
    defaultColor: string;
    radius: number;
    isOn: boolean;

    constructor(numPoints: number, color: string, radius: number, existingPoints: createjs.Shape[]) {
        this.color = color;
        this.defaultColor = color;
        this.radius = radius;

        this.shapes = [];
        for (let i = 0; i < existingPoints.length; i++) {
            this.shapes.push(existingPoints[i]);
        }

        for (let i = this.shapes.length; i < numPoints; i++) {
            this.shapes.push(new createjs.Shape());
        }
    }

    public get getColor() {
        return this.color;
    }

    public get getRadius() {
        return this.radius;
    }

    public get getShapes() {
        return this.shapes;
    }

    public get getDColor() {
        return this.defaultColor;
    }

    public get getToggle() {
        return this.isOn;
    }

    public setShapes(index: number, shape: createjs.Shape) {
        this.shapes[index] = shape;
    }

    public toggle(onOff: boolean) {
        this.isOn = onOff;
        if (this.isOn) {
            this.color = this.defaultColor;            
        } else {
            this.color = "rgba(0,0,0,0)"
        }
    }
}

// create point
function fillCircle(circle: createjs.Shape,radius: number,xPos: number,yPos: number,color: string,stage: any) {
    circle.graphics.beginFill(color).drawCircle(0,0,radius);
    circle.x = xPos; circle.y = yPos;
    stage.update();
    return circle;
}

// draw line between two points
function drawLine(P0: createjs.Shape,P1: createjs.Shape,line: createjs.Shape,color: string,stage: createjs.Stage) {
    line.graphics.setStrokeStyle(2).beginStroke(color);
    line.graphics.moveTo(P0.x,P0.y);
    line.graphics.lineTo(P1.x,P1.y).endStroke();
    stage.update();
}

// Take points and interpoints, place interpoints on lines connecting points
// t represents progress from one end of line to the other
function updateInterpoints(points: Points,interpoints: Points,t: number,stage: createjs.Stage): Points {
    let pShapes: createjs.Shape[] = points.getShapes;
    let iShapes: createjs.Shape[] = interpoints.getShapes;

    iShapes.forEach(shape => {
        shape.graphics.clear();
    })
    
    for (let i = 0; i < points.getShapes.length - 1; i++) {
        let xPos = (pShapes[i+1].x - pShapes[i].x)*t + pShapes[i].x;
        let yPos = (pShapes[i+1].y - pShapes[i].y)*t + pShapes[i].y;
        interpoints.setShapes(i,fillCircle(iShapes[i],interpoints.getRadius,xPos,yPos,interpoints.getColor,stage));
    }
    stage.update();
    return interpoints;
}

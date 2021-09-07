var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");
context.fillStyle = 'red';
fillCircle(context, 50, 50, 20);
function fillCircle(contextObj, x, y, r) {
    contextObj.beginPath();
    contextObj.arc(x, y, r, 0, 2 * Math.PI);
    contextObj.fill();
}

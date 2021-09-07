var context = document.getElementById('myCanvas').getContext('2d');
context.fillStyle = 'red';
// fillCircle(context, 50, 50, 20);

// function fillCircle (contextObj, x, y, r): void {
//     contextObj.beginPath();
//     contextObj.arc(x, y, r, 0, 2*Math.PI)
//     contextObj.fill();
// }

function add(x: number, y: number): number {
    return x + y;
}
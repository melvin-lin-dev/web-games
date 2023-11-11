// function convertRadius(radius, rotation, x, y){
//     let x =
// }

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function getDistance(obj1, obj2) {
    let distX = Math.abs(obj1.x - obj2.x);
    let distY = Math.abs(obj1.y - obj2.y);
    return {
        x: distX,
        y: distY,
        xy: Math.hypot(distX, distY)
    }
}

function getRotatedPoint(radius, rotation, x = 0, y = 0) {
    return {
        x: x + radius * Math.cos(degToRad(rotation)),
        y: y + radius * Math.sin(degToRad(rotation))
    }
}

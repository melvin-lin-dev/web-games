function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBall() {
    return colors[random(0, colors.length - 1)];
}

function degreeToRadian(type, degree) {
    return Math[type](degree * Math.PI / 180);
}

function checkCircleCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < ball.r + ball.r;
}

function pushMid(index, ball){
    balls.splice(index, 0, ball);
}

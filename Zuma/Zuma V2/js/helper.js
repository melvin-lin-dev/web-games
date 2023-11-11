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
    let dx = ball1.left - ball2.left;
    let dy = ball1.top - ball2.top;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < ball.r + ball.r;
}

function pushMid(index, newBall, trainBall) {
    svg.insertBefore(newBall.el, trainBall.el);
    balls.splice(index, 0, newBall);
}

function createBall(color = ''){
    let newBall = document.createElementNS(ns, 'circle');
    newBall.setAttribute('fill', color ? color : randomBall());
    newBall.setAttribute('r', ball.r);
    return newBall;
}

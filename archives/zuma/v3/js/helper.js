function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBall() {
    return colors[random(0, colors.length - 1)];
}

function degreeToRadian(type, degree) {
    return Math[type](degree * Math.PI / 180);
}

function pushMid(index, newBall) {
    balls.splice(index, 0, newBall);
}

function turnColor() {
    balls[0].type = 'green';
    balls[1].type = 'blue';
    balls[2].type = 'blue';
    balls[3].type = 'red';
    balls[4].type = 'red';
    balls[5].type = 'red';
    balls[6].type = 'red';
    balls[7].type = 'blue';

    player.ball.current.type = 'red';

    // setTimeout(() => {
    //     checkSameBalls();
    // }, 1000);
}

function remove(sameBalls){
    let tempBalls = [...balls];

    sameBalls.forEach(sameBall => {
        balls.splice(balls.indexOf(tempBalls[sameBall]), 1);
    });
}

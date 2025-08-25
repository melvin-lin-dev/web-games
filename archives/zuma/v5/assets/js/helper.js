function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBall() {
    return colors[random(0, colors.length - 1)];
}

function degreeToRadian(type, degree) {
    return Math[type](degree * Math.PI / 180);
}

function arc(type, number) {
    return Math['a' + type](number) * 180 / Math.PI;
}

function pushMid(id, index, newBall) {
    balls[id].splice(index, 0, newBall);
}

function turnColor() {
    balls[0][0].type = 'green';
    balls[0][1].type = 'blue';
    balls[0][2].type = 'blue';
    balls[0][3].type = 'red';
    balls[0][4].type = 'red';
    balls[0][5].type = 'red';
    balls[0][6].type = 'red';
    balls[0][7].type = 'green';
    balls[0][8].type = 'blue';
    balls[0][9].type = 'green';
    balls[0][10].type = 'green';

    player.ball.current.type = 'red';
    player.ball.future.type = 'red';

    // setTimeout(() => {
    //     checkSameBalls();
    // }, 1000);
}

function remove(id, sameBalls) {
    let tempBalls = [...balls[id]];

    sameBalls.forEach(sameBallIndex => {
        let currentBall = tempBalls[sameBallIndex];
        currentBall.createParticles();
        balls[id].splice(balls[id].indexOf(currentBall), 1);
    });
}

function loadLocation(percent) {
    let percentIndex = Math.floor(percent * pathLength * 10) / 10;
    return savedLocation[percentIndex] = savedLocation[percentIndex] || path.getPointAtLength(percentIndex);
}

function getDegree(front, side) {
    let degree = Math.atan(Math.abs(front / side)) * 180 / Math.PI;

    if (side < 0 && front < 0) {
        degree = 90 + 90 - degree;
    } else if (side < 0 && front >= 0) {
        degree += 180;
    } else if (side >= 0 && front >= 0) {
        degree = 270 + 90 - degree;
    }

    return degree;
}

function getRotation(sourcePoint, collidePoint, targetPoint) {
    let collideToSourcePoint = {
        front: collidePoint.x - sourcePoint.x,
        side: collidePoint.y - sourcePoint.y
    };
    let collideToSource = Math.hypot(collideToSourcePoint.front, collideToSourcePoint.side);

    let collideToTargetPoint = {
        front: collidePoint.x - targetPoint.x,
        side: collidePoint.y - targetPoint.y
    };
    let collideToTarget = Math.hypot(collideToTargetPoint.front, collideToTargetPoint.side);

    let sourceToTargetPoint = {
        front: sourcePoint.x - targetPoint.x,
        side: sourcePoint.y - targetPoint.y
    };
    let sourceToTarget = Math.hypot(sourceToTargetPoint.front, sourceToTargetPoint.side);

    let arcCos = (collideToSource ** 2 + collideToTarget ** 2 - sourceToTarget ** 2) / (2 * collideToSource * collideToTarget);

    // console.log(collideToSource, collideToTarget, sourceToTarget);
    // console.log(collideToSource, collideToTarget);
    // console.log(arcCos);

    return arc('cos', arcCos);
}

function getRotationPosition(radius, rotation, x = 0, y = 0){
    return {
        x: x + radius * degreeToRadian('cos', rotation),
        y: y + radius * degreeToRadian('sin', rotation)
    }
}

function clearScreen(){
    for(let id in context){
        context[id].clearRect(0,0,canvas[id].width, canvas[id].height);
    }
}

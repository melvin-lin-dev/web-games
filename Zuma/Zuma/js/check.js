function checkCollision() {
    shootBalls.forEach((shootBall, shootBallIndex) => {
        balls.forEach((trainBall, index) => {
            if (checkCircleCollision(shootBall, trainBall)) {
                shootBall.percent = trainBall.percent;
                trainBall.percent += 10;
                pushMid(index + 1, shootBall);
                shootBalls.splice(shootBallIndex, 1);
            }
        })
    })
}

function checkOutOfBounds() {
    shootBalls.forEach((ball, index) => {
        if (ball.x < 0 || ball.y < 0 || ball.x > cvs.width || ball.y > cvs.height) {
            shootBalls.splice(index, 1);
        }
    })
}

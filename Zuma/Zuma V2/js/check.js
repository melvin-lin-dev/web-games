function check() {
    checkOutOfBounds();
    checkCollision();
    checkEnd();
}

function checkCollision() {
    shootBalls.forEach((shootBall, shootBallIndex) => {
        balls.forEach((trainBall, index) => {
            let shootBallRect = shootBall.el.getBoundingClientRect();
            let trainBallRect = trainBall.el.getBoundingClientRect();

            if (checkCircleCollision(shootBallRect, trainBallRect)) {
                let newBall = new Ball(createBall(shootBall.el.style.backgroundColor));
                newBall.percent = trainBall.percent;
                trainBall.percent += ball.margin / scale;

                pushMid(index, newBall, trainBall);

                shootBall.el.remove();
                shootBalls.splice(shootBallIndex, 1);
            }
        })
    })
}

function checkOutOfBounds() {
    shootBalls.forEach((shootBall, index) => {
        let shootBallRect = shootBall.el.getBoundingClientRect();
        if (shootBallRect.left + ball.r * 2 < 0 || shootBallRect.top + ball.r * 2 < 0 || shootBallRect.left > window.innerWidth || shootBallRect.top > window.innerHeight) {
            shootBall.el.remove();
            shootBalls.splice(index, 1);
        }
    })
}

function checkEnd(){
    if(balls[0].percent >= 1){
        alert(balls.length);
    }
}

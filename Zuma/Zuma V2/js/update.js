function update() {
    updateMouth();
    updateBalls();
    updateShootBalls();
}

function updateMouth(){
    [...end.el.children].forEach(mouth => {
        let value = 1;
        let range = end.range / scale;
        let currentRange = (range - (value - balls[0].percent));

        if (currentRange >= 0) {
            mouth.style.margin = `${(currentRange / range * 50) + 50}% 0`;
        }
    });
}

function updateBalls() {
    balls.forEach(ball => {
        ball.update();
    })
}

function updateShootBalls() {
    shootBalls.forEach(shootBall => {
        let shootBallRect = shootBall.el.getBoundingClientRect();
        let shootBallX = ball.shootSpeed * degreeToRadian('cos', shootBall.rotate);
        let shootBallY = ball.shootSpeed * degreeToRadian('sin', shootBall.rotate);

        shootBall.el.style.left = shootBallRect.left + shootBallX + 'px';
        shootBall.el.style.top = shootBallRect.top + shootBallY + 'px';
    })
}

function update() {
    player.draw();

    updateEnd();
    updateBalls();
    updateShootBalls();
}

function updateEnd() {
    if (balls[0]) {
        [...end.el.children].forEach(mouth => {
            let value = 1;
            let range = end.range / scale;
            let currentRange = (range - (value - balls[0].percent));

            if (gameOver) {
                mouth.style.margin = `100% 0`;
            } else if (currentRange >= 0) {
                mouth.style.margin = `${(currentRange / range * 50) + 50}% 0`;
            }
        });
    }
}

function updateBalls() {
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    })
}

function updateShootBalls() {
    shootBalls.forEach(shootBall => {
        shootBall.shootUpdate();
        shootBall.draw();
    })
}

function check() {
    checkOutOfBounds();
    checkCollision();

    if (!startingPhase) checkDistance();

    // checkSameBalls();
    // checkEnd();
    checkGameOver();
}

function checkBallCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.hypot(dx, dy);

    return distance < ball.r + ball.r;
}

function checkCollision() {
    balls.forEach((trainBall, index) => {
        shootBalls.forEach((shootBall, shootBallIndex) => {
            if (checkBallCollision(shootBall, trainBall)) {
                shootBall.percent = trainBall.percent;

                for (let i = index; i >= 0; i--) {
                    // console.log(i);
                    balls[i].percent += ball.margin * 1.5 / scale;
                }

                pushMid(index + 1, shootBall);

                shootBalls.splice(shootBallIndex, 1);

                checkSameBalls(index + 1);
            }
        })
    });

    // if(reverseBallIndexes.length) alert(reverseBallIndexes.length);

    balls.forEach((ball1, ballIndex) => {
        let ball2 = balls[ballIndex + 1];

        if (ball2) {
            if (checkBallCollision(ball1, ball2) && ball1.direction !== ball2.direction) {
                let index = reverseBallIndexes.indexOf(ballIndex);

                if (index + 1) {
                    checkSameBalls(ballIndex);
                }

                for (let i = ballIndex; i >= 0; i--) {
                    balls[i].directionMode('normal');
                }
            }
        }
    })
}

function checkOutOfBounds() {
    shootBalls.forEach((shootBall, index) => {
        if (shootBall.x + ball.r * 2 < 0 || shootBall.y + ball.r * 2 < 0 || shootBall.x > window.innerWidth || shootBall.y > window.innerHeight) {
            shootBalls.splice(index, 1);
        }
    })
}

function checkEnd() {
    if (balls[0].percent >= 1) {
        alert(balls.length);
    }
}

function checkSameBalls(ballIndex) {
    let currentBall = balls[ballIndex];
    let tempIndex = ballIndex;

    let sameBalls = [ballIndex];

    let dirs = [-1, 1];

    dirs.forEach(dir => {
        while (true) {
            tempIndex += dir;

            if ((dir === -1 && tempIndex >= 0) || (dir === 1 && tempIndex < balls.length)) {
                let nextBall = balls[tempIndex];

                if (nextBall.type === currentBall.type) {
                    sameBalls.push(tempIndex);
                } else {
                    // console.log(sameBalls);
                    break;
                }
            } else {
                break;
            }
        }

        tempIndex = ballIndex;
    });

    if (sameBalls.length >= 3) {
        remove(sameBalls);
    }
    // let sameBalls = [];
    //
    // for (let i = 0; i < balls.length - 1; i++) {
    //     console.log(i);
    //     let currentSameBalls = [];
    //
    //     let index = i;
    //
    //     while (index < balls.length - 1) {
    //         let ball1 = balls[index];
    //         let ball2 = balls[index + 1];
    //
    //         if (ball1.type === ball2.type) {
    //             if (!currentSameBalls.length) currentSameBalls.push(index);
    //
    //             currentSameBalls.push(index + 1);
    //         } else {
    //             // console.log(sameBalls, currentSameBalls);
    //
    //             if (currentSameBalls.length >= 3) {
    //                 sameBalls = [...sameBalls, ...currentSameBalls];
    //             }
    //             currentSameBalls = [];
    //             i = index;
    //             break;
    //         }
    //
    //         index++;
    //     }
    // }
    //
    // remove(sameBalls);
}

function checkDistance() {
    reverseBallIndexes = [];

    for (let i = balls.length - 1; i > 0; i--) {
        let ball1 = balls[i];
        let ball2 = balls[i - 1];

        if (!checkBallCollision(ball1, ball2)) {
            let mode = ball1.type === ball2.type ? 'reverse' : 'stop';

            if (mode === 'reverse') {
                reverseBallIndexes.push(i - 1);
            }

            for (let j = i - 1; j >= 0; j--) {
                balls[j].directionMode(mode);
            }
        }
    }
}

function checkGameOver() {
    if (balls.length) {
        let headBall = balls[0];

        if (headBall.percent >= 1) {
            gameOver = true;
            ball.speed = ball.gameOverSpeed;
            balls.splice(0, 1);

            if (!balls.length) {
                render = false;
                gameOverContainer.classList.add('active');
            }
        }
    }
}

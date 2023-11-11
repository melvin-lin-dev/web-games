function check() {
    for(let id in players){
        checkOutOfBounds(id);
        checkCollision(id);

        if (!startingPhase) checkDistance(id);

        checkGameOver(id);
    }
}

function checkBallCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.hypot(dx, dy);

    return distance < ball.r + ball.r;
}

function checkCollision(id) {
    balls[id].forEach((trainBall, index) => {
        shootBalls[id].forEach((shootBall, shootBallIndex) => {
            if (checkBallCollision(shootBall, trainBall)) {
                let sourcePoint = {...shootBall};

                // RIGHT
                let rightBall = loadLocation(trainBall.percent + ball.margin);
                let rightFront = shootBall.x - rightBall.x;
                let rightSide = shootBall.y - rightBall.y;
                let rightHypot = Math.hypot(rightFront, rightSide);

                // LEFT
                leftBall = loadLocation(trainBall.percent - ball.margin);
                let leftFront = shootBall.x - leftBall.x;
                let leftSide = shootBall.y - leftBall.y;
                let leftHypot = Math.hypot(leftFront, leftSide);

                let newIndex = index + (leftHypot < rightHypot);

                pushMid(id, newIndex, shootBall);
                shootBalls[id].splice(shootBallIndex, 1);

                // + ball.margin * (newIndex === index)
                let newBall = balls[id][newIndex];
                newBall.percent = trainBall.percent;

                let check = loadLocation(newBall.percent - ball.margin);
                let checkNotCollide = balls[id][newIndex + 1] ? !checkBallCollision(check, balls[id][newIndex + 1]) : true;
                if (checkNotCollide) { // Check if current ball before isn't collide with ball that are in behind
                    newBall.percent -= ball.margin;
                } else { // Otherwise
                    newBall.percent = balls[id][newIndex + 1].percent + ball.margin;
                }

                newBall.updatePosition();

                let startIndex = index - (newIndex === index);
                let newBallCollide = startIndex >= 0 ? checkBallCollision(newBall, balls[id][startIndex]) : false;

                let collidePoint = loadLocation(trainBall.percent);

                for (let i = startIndex; i >= 0; i--) {
                    let currentBall = balls[id][i];

                    if (!checkBallCollision(currentBall, balls[id][i + 1])) {
                        break;
                    }

                    if (newBallCollide) {
                        currentBall.push.target = (newBall.percent + ball.margin * (startIndex - i + 1)) - currentBall.percent;
                        // currentBall.percent = newBall.percent + ball.margin * (startIndex - i + 1);
                    } else {
                        // currentBall.percent += ball.margin;
                        currentBall.push.target = ball.margin;
                    }

                    currentBall.push.direction = 1;

                    if (i === index && newIndex !== index) {
                        collidePoint = loadLocation(currentBall.percent + currentBall.push.target);
                        // console.log('b', currentBall.percent + currentBall.push.target);
                    }
                }

                // console.log(newBall.percent, trainBall.percent);
                // Ganti TrainBall dengan CollidePoint
                // Prob. 1: beda rotasi aneh

                // Pakai trainBall
                // Prob. 1: Ada NAN untuk newindex === index karena trainBall harusnya dipush
                // , getRotation(sourcePoint, trainBall, newBall)
                newBall.startRotateAnimation(trainBall, sourcePoint);

                sound('shoot-collide');
            }
        })
    });

    balls[id].forEach((ball1, ballIndex) => {
        let ball2 = balls[id][ballIndex + 1];

        if (ball2) {
            if (checkBallCollision(ball1, ball2) && ball1.direction !== ball2.direction) {
                let index = reverseBallIndexes[id].indexOf(ballIndex);

                if (index + 1) {
                    checkSameBalls(id, ballIndex);
                }

                for (let i = ballIndex; i >= 0; i--) {
                    balls[id][i].directionMode('normal');
                }

                sound('ball-collide');
            }
        }
    });
}

function checkOutOfBounds(id) {
    shootBalls[id].forEach((shootBall, index) => {
        if (shootBall.x + ball.r * 2 < 0 || shootBall.y + ball.r * 2 < 0 || shootBall.x > window.innerWidth || shootBall.y > window.innerHeight) {
            shootBalls[id].splice(index, 1);
        }
    })
}

function checkSameBalls(id, ballIndex) {
    // alert('same ball');
    let currentBall = balls[id][ballIndex];
    let tempIndex = ballIndex;

    let sameBalls = [ballIndex];

    let dirs = [-1, 1];

    dirs.forEach(dir => {
        while (true) {
            tempIndex += dir;

            if ((dir === -1 && tempIndex >= 0) || (dir === 1 && tempIndex < balls[id].length)) {
                let nextBall = balls[id][tempIndex];

                if (nextBall.type === currentBall.type && checkBallCollision(nextBall, balls[id][tempIndex + dir * -1])) {
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

    // console.log(sameBalls.length);

    if (sameBalls.length >= 3) {
        // if(currentBall.isDirection('reverse')){
        for (let i = ballIndex; i < balls[id].length; i++) {
            balls[id][i].push.direction = -1;
            balls[id][i].push.target -= ball.margin * scoreMultiplier[id] * 1.5;
        }
        // }
        // console.log(currentBall.direction);

        scoreMultiplier[id]++;
        let firstBall = balls[id][sameBalls[0]];
        let lastBall = balls[id][sameBalls[sameBalls.length - 1]];
        scores[id].push(new Score(id, firstBall, lastBall, sameBalls.length));

        sound('break');

        remove(id, sameBalls);
    }
}

function checkDistance(id) {
    reverseBallIndexes[id] = [];

    for (let i = balls[id].length - 1; i > 0; i--) {
        let ball1 = balls[id][i];
        let ball2 = balls[id][i - 1];

        if (!checkBallCollision(ball1, ball2)) {
            let mode = ball1.type === ball2.type ? 'reverse' : 'stop';

            if (mode === 'reverse') {
                reverseBallIndexes[id].push(i - 1);
            }

            for (let j = i - 1; j >= 0; j--) {
                balls[id][j].directionMode(mode);
            }
        }
    }

    // console.log(reverseBallIndexes);

    checkScoreMultiplier(id);
}

function checkGameOver(id) {
    if (balls[id].length) {
        let headBall = balls[id][0];

        if (headBall.percent >= 1) {
            if (!gameOver) {
                sound('light-trail');
            }

            gameOver = true;
            ball.speed = ball.gameOverSpeed;
            balls[id].splice(0, 1);

            if (!balls[id].length) {
                toneSound.lightTrail.tone.disconnect();
                toneSound.lightTrail.pitchShift.pitch = 1.3;

                render = false;
                gameOverContainer.classList.add('active');
            }
        }
    }
}

function checkScoreMultiplier(id) {
    if (!reverseBallIndexes[id].length) {
        scoreMultiplier[id] = 0;
    }
}

function checkLastBallMargin(){
    for(let id in players){
        if(balls[id].length){
            balls[id][balls[id].length - 1].percent = ball.margin;
        }
    }
}

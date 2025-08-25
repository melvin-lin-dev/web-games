function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findDistance(from, to) {
    let a = Math.abs(from.x - to.x);
    let b = Math.abs(from.y - to.y);

    return Math.sqrt((a ** 2) + (b ** 2));
}

function isCollide(circle1, circle2) {
    return findDistance(circle1, circle2) < circle1.r + circle2.r;
}

function convertToDegree(front, side) {
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

function animateScore() {
    if (status.score.value < status.score.target) {
        status.score.value++;
    } else {
        status.score.value = status.score.target;
    }
}

function nextWave() {
    status.wave.value++;
    status.wave.show = true;

    if (waveData[status.wave.value] === 'boss') {
        generateBoss();
    }

    drawNextWave();
}

function animateWave() {
    if (status.wave.show) {
        if (!status.wave.isShow) {
            status.wave.fontSize.value += status.wave.fontSize.speed;

            if (status.wave.fontSize.value >= status.wave.fontSize.target) {
                status.wave.fontSize.value = status.wave.fontSize.target;
                status.wave.show = false;

                setTimeout(() => {
                    status.wave.show = true;
                    status.wave.isShow = true;
                }, 1000);
            }
        } else {
            status.wave.fontSize.value -= status.wave.fontSize.speed;

            if (status.wave.fontSize.value <= 0) {
                status.wave.show = false;
                status.wave.isShow = false;
                status.wave.fontSize.value = 0;

                if (typeof waveData[status.wave.value] !== 'string') {
                    generateZombies();
                }
            }
        }
    }
}

function reset() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    gameOverContainer.classList.remove('active');

    move = {
        left: false,
        up: false,
        down: false,
        right: false,
    };

    zombies = [];

    status = {
        wave: {
            value: 0,
            fontSize: {
                value: 0,
                target: 100,
                speed: 5,
            },
            isShow: false,
            show: false,
        },
        score: {
            value: 0,
            target: 0
        }
    };

    particles = [];

    gameStart = false;
    gameOver = false;

    countDown.value = 3; //Count Down

    player = '';

    instructionContainer.children[0].classList.remove('hide');

    setTimeout(() => {
        instructionContainer.classList.add('active');

        let animatedEls = document.querySelectorAll('.instruction-container > div *:not(ul)');

        let time = 0;
        animatedEls.forEach((el, index) => {
            time += index / 20;

            setTimeout(() => {
                el.classList.add('active');
            }, time * 1000);
        });
    }, 400);
}

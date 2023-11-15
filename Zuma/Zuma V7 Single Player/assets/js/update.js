function update() {
    clearScreen();

    updateEnd();
    updateBalls();

    player.draw();

    updateShootBalls();
    updateParticles();
    updateScores();
}

function updateEnd() {
    if (!gameOver || true) {
        end.milliseconds += 10;

        if (balls[0]) {
            [...end.el.children].forEach(mouth => {
                if (gameOver) {
                    mouth.style.margin = `-50% 0`;
                    end.milliseconds = 0;
                    lightTrail.milliseconds = 0;
                } else if (balls[0].percent * 100 >= 100 - endProp.range) {
                    let currentRange = endProp.range - (balls[0].percent * 100 - (100 - endProp.range));

                    let frame = 5;
                    let currentMargin = currentRange / endProp.range * 50;
                    let margin = 50 - Math.floor(currentMargin / frame) * frame;

                    mouth.style.margin = `${-margin}% 0`;

                    let soundFrame = 40;
                    let mod = 50 * soundFrame - margin / 50 * soundFrame * 30;

                    if (end.milliseconds % mod === 0 && end.milliseconds) {
                        end.milliseconds = 0;
                        sound('warning');
                    }

                    if (lightTrail.milliseconds % 2500 === 0) {
                        generateLightTrail(balls[0].percent);
                        // console.log(lightTrails.length);
                    }

                    lightTrail.milliseconds += 10;

                    updateLightTrail();
                }
            });
        }
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

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.draw();

        if (!particle.particles.length) {
            particles.splice(index, 1);
        }
    });
}

function updateScores() {
    scores.forEach((score, index) => {
        score.draw();
        score.update();

        if (score.opacity <= 0) {
            scores.splice(index, 1);
        }
    })
}

function updateLightTrail() {
    lightTrail.pitch.value -= lightTrail.pitch.shiftSpeed;
    lightTrail.playbackRate.value += lightTrail.playbackRate.shiftSpeed;

    toneSound.lightTrail.pitchShift.pitch = lightTrail.pitch.value < lightTrail.pitch.min ? lightTrail.pitch.min : lightTrail.pitch.value;
    toneSound.lightTrail.tone.playbackRate = lightTrail.playbackRate.value > lightTrail.playbackRate.max ? lightTrail.playbackRate.max : lightTrail.playbackRate.value;

    lightTrails.forEach((trail, index) => {
        ctx.save();
        ctx.beginPath();

        let point = loadLocation(trail.percent);

        ctx.fillStyle = lightTrail.color;
        ctx.arc(point.x, point.y, lightTrail.r, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();

        trail.percent += lightTrail.speed;

        if (trail.percent >= 1) {
            lightTrails.splice(index, 1);
        }
    });

    if (!lightTrails.length) {
        end.el.classList.add('active');

        setTimeout(() => {
            end.el.classList.remove('active');
        }, 300);
    }
}

function updatePath(listPaths, pathEl, endEl) {
    let d = '';

    listPaths.forEach(path => {
        d += path.type;

        path.locations.forEach(location => {
            d += location + ' ';
        });
    });

    pathEl.setAttribute('d', d);
    pathEl.nextElementSibling.setAttribute('d', d);

    updateEndPosition(listPaths, endEl);
}

function updateEndPosition(listPaths, endEl) {
    let position;

    if (listPaths.length) {
        let lastPosition = listPaths[listPaths.length - 1].locations;
        position = lastPosition[lastPosition.length - 1].split(',');
    } else {
        position = [0, 0];
    }

    endEl.style.left = position[0] - endProp.r * 1.2 + 'px';
    endEl.style.top = position[1] - endProp.r * 1.2 + 'px';
}

function update() {
    clearScreen();

    updatePlayers();

    for (let id in players) {
        let ctx = context[id];

        updateEnd(id, ctx);
        updateBalls(id, ctx);
        updateShootBalls(id, ctx);
        updateParticles(id, ctx);
        updateScores(id, ctx);
    }
}

function updatePlayers() {
    for (let id in players) {
        players[id].draw(context[id]);
    }
}

function updateEnd(id) {
    end[id].milliseconds += 10;

    if (balls[id][0]) {
        [...end[id].el.children].forEach(mouth => {
            let value = 1;
            let range = endProp.range / scale;
            let currentRange = (range - (value - balls[id][0].percent));

            if (gameOver) {
                mouth.style.margin = `100% 0`;
                end[id].milliseconds = 0;
                lightTrail.milliseconds = 0;
            } else if (currentRange >= 0) {
                let frame = 5;
                let currentMargin = currentRange / range * 50;
                let margin = Math.floor(currentMargin / frame) * frame;

                mouth.style.margin = `${margin + 50}% 0`;

                let soundFrame = 40;
                let mod = 50 * soundFrame - margin / 50 * soundFrame * 30;

                if (end[id].milliseconds % mod === 0 && end[id].milliseconds) {
                    end[id].milliseconds = 0;
                    sound('warning');
                }

                if (lightTrail.milliseconds % 2500 === 0) {
                    generateLightTrail(id, balls[0].percent);
                    // console.log(lightTrails.length);
                }

                lightTrail.milliseconds += 10;

                // updateLightTrail();
            }
        });
    }
}

function updateBalls(id, ctx) {
    balls[id].forEach(ball => {
        ball.update();
        ball.draw(ctx);
    })
}

function updateShootBalls(id, ctx) {
    shootBalls[id].forEach(shootBall => {
        shootBall.shootUpdate();
        shootBall.draw(ctx);
    })
}

function updateParticles(id, ctx) {
    particles[id].forEach((particle, index) => {
        particle.draw(ctx);

        if (!particle.particles.length) {
            particles[id].splice(index, 1);
        }
    });
}

function updateScores(id, ctx) {
    scores[id].forEach((score, index) => {
        score.draw(ctx);
        score.update();

        if (score.opacity <= 0) {
            scores[id].splice(index, 1);
        }
    })
}

function updateLightTrail() {
    lightTrail.pitch.value -= lightTrail.pitch.shiftSpeed;
    lightTrail.playbackRate.value += lightTrail.playbackRate.shiftSpeed;

    toneSound.lightTrail.pitchShift.pitch = lightTrail.pitch.value < lightTrail.pitch.min ? lightTrail.pitch.min : lightTrail.pitch.value;
    toneSound.lightTrail.tone.playbackRate = lightTrail.playbackRate.value > lightTrail.playbackRate.max ? lightTrail.playbackRate.max : lightTrail.playbackRate.value;

    lightTrails[id].forEach((trail, index) => {
        ctx.save();
        ctx.beginPath();

        let point = loadLocation(trail.percent);

        ctx.fillStyle = lightTrail.color;
        ctx.arc(point.x, point.y, lightTrail.r, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();

        trail.percent += lightTrail.speed / scale;

        if (trail.percent >= 1) {
            lightTrails[id].splice(index, 1);
        }
    });

    if (!lightTrails[id].length) {
        end[id].el.classList.add('active');

        setTimeout(() => {
            end[id].el.classList.remove('active');
        }, 300);
    }
}

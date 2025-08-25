function draw() {
    drawParticles();

    drawPlayer();
    drawZombies();

    drawScore();
    drawCurrentWave();
    drawNextWave();
}

function drawPlayer() {
    player.draw();
    player.move();
}

function drawZombies() {
    zombies.forEach(zombie => {
        zombie.draw();
        zombie.move();
    })
}

function drawScore() {
    let displayedScore = (zeroFill + status.score.value).slice(-zeroFillDigits);
    let marginTop = 13;

    ctx.save();
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.font = '60px game-font';
    ctx.fillStyle = 'white';
    ctx.fillText(displayedScore, cvs.width / 2, marginTop);
    ctx.lineWidth = '2';
    ctx.strokeText(displayedScore, cvs.width / 2, marginTop);
    ctx.restore();

    animateScore();
}

function drawCurrentWave() {
    let currentWave = typeof waveData[status.wave.value] === 'string' ? waveData[status.wave.value].toUpperCase() : `WAVE ${status.wave.value}`;
    let marginTop = 5;

    ctx.save();
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.font = '30px game-font';
    ctx.fillStyle = 'white';
    ctx.fillText(currentWave, cvs.width / 2, 60 + marginTop);
    ctx.lineWidth = '1.5';
    ctx.strokeText(currentWave, cvs.width / 2, 60 + marginTop);
    ctx.restore();
}

function drawNextWave() {
    let currentWave = typeof waveData[status.wave.value] === 'string' ? waveData[status.wave.value].toUpperCase() : `WAVE ${status.wave.value}`;

    ctx.save();
    ctx.font = `${status.wave.fontSize.value}px game-font`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(currentWave, cvs.width / 2, cvs.height / 2);
    ctx.lineWidth = '3';
    ctx.strokeText(currentWave, cvs.width / 2, cvs.height / 2);
    ctx.restore();

    animateWave();
}

function drawParticles() {
    particles.forEach((particle, particleIndex) => {
        particle.draw();
        particle.update();

        if (particle.globalAlpha <= 0) {
            particles.splice(particleIndex, 1);
        }
    })
}

function generateBall() {
    socket.emit('generate_ball', {
        id: playerIndex,
        type: randomBall()
    });
}

function generateLightTrail(percent = 0) {
    for (let id in players) {
        for (let i = 0; i < lightTrail.quantity; i++) {
            lightTrails[id].push({
                percent: percent + lightTrail.margin * -lightTrail.quantity * i
            })
        }
    }
}

function generateGameOverParticles() {
    if (Math.random() < 0.15) {
        particles[gameOver].push(new Particle(player.x + playerSize.width / 2, player.y + playerSize.height / 2, `rgb(${random(50, 255)},${random(50, 255)},${random(50, 255)})`, 15, 1.5));
    }
}

function generateBall() {
    balls.push(new Ball(randomBall()));
}

function generateLightTrail(percent = 0) {
    for (let i = 0; i < lightTrail.quantity; i++) {
        lightTrails.push({
            percent: percent + lightTrail.margin * -lightTrail.quantity * i
        })
    }
}

function generateGameOverParticles() {
    if (Math.random() < 0.15) {
        particles.push(new Particle(player.x + playerSize.width / 2, player.y + playerSize.height / 2, `rgb(${random(50, 255)},${random(50, 255)},${random(50, 255)})`, 15, 1.5));
    }
}

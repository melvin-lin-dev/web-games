function generateBall() {
    balls.push(new Ball(randomBall()));
}

function generatePath() {
    let d = '';

    paths.forEach(path => {
        d += path.type;

        path.locations.forEach(location => {
            d += location + ' ';
        });
    });

    path.setAttribute('d', d);
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
        particles.push(new Particle(player.x + player.w / 2, player.y + player.h / 2, `rgb(${random(50, 255)},${random(50, 255)},${random(50, 255)})`, 15, 1.5));
    }
}

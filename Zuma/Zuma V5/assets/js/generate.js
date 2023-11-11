function generateBall() {
    // for(let id in players){
    // balls[id].push(new Ball(randomBall()));
    // console.log(id);
    socket.emit('generate_ball', {
        id: playerIndex,
        type: randomBall()
    });
    // }
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

function generateLightTrail(id, percent = 0) {
    for (let i = 0; i < lightTrail.quantity; i++) {
        lightTrails[id].push({
            percent: percent + lightTrail.margin * -lightTrail.quantity * i
        })
    }
}

function generateGameOverParticles() {
    if (Math.random() < 0.15) {
        particles.push(new Particle(player.x + player.w / 2, player.y + player.h / 2, `rgb(${random(50, 255)},${random(50, 255)},${random(50, 255)})`, 15, 1.5));
    }
}

function generateZombies() {
    for (let i = 0; i < waveData[status.wave.value]; i++) {
        generateZombie();
    }
}

function generateZombie(type = 'minion') {
    while (true) {
        let x = random(0, cvs.width);
        let y = random(0, cvs.height);
        let r = type === 'minion' ? 20 : 50;

        let newZombie = {
            x, y, r
        };

        let collide = false;

        zombies.forEach(zombie => {
            if (isCollide(newZombie, zombie)) {
                collide = true;
            }
        });

        if (!collide && !isCollide(newZombie, player)) {
            zombies.push(new Zombie(x, y, r, type));
            break;
        }
    }
}

function generateZeroFill() {
    for (let i = 0; i < zeroFillDigits; i++) {
        zeroFill += '0'
    }
}

function generateParticles(x, y, type) {
    let quantity;

    switch (type) {
        case 'blood':
            quantity = random(5, 10);
            break;
    }

    for (let i = 0; i < quantity; i++) {
        particles.push(new Particle(x, y, type));
    }
}

function generateBoss() {
    generateZombie('boss');
}

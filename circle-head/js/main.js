function start() {
    generateZeroFill();

    player = new Player(cvs.width / 2, cvs.height / 2);

    countDown.el.innerHTML = countDown.value;
    instructionContainer.children[0].classList.add('hide');

    setTimeout(() => {
        countDown.el.classList.add('active');

        countDown.interval = setInterval(() => {
            countDown.el.innerHTML--;

            if (!parseInt(countDown.el.innerHTML)) {
                clearInterval(countDown.interval);

                countDown.el.classList.remove('active');

                setTimeout(() => {
                    instructionContainer.classList.remove('active');

                    setTimeout(() => {
                        gameStart = true;

                        nextWave();
                        update();
                    }, 400);
                }, 400);
            }
        }, 1000);
    }, 400);
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        checkCollision();

        draw();

        if (waveData[status.wave.value] === 'infinite') {
            if (Math.random() < .005) {
                if (zombies.length < 15) {
                    generateZombie();
                }
            }
        }

        requestAnimationFrame(update);
    } else {
        document.querySelector('#final-score').innerHTML = status.score.value;

        gameOverContainer.classList.add('active');
    }
}

function checkCollision() {
    zombies.forEach((zombie, zombieIndex) => {
        player.bullet.bullets.forEach((bullet, bulletIndex) => {
            let bulletCenterX = bullet.x + bullet.w / 2;
            let bulletCenterY = bullet.y + bullet.h / 2;
            //
            // let distX = Math.abs(zombie.x - bulletCenterX);
            // let distY = Math.abs(zombie.y - bulletCenterY);
            //
            // let checkX = bullet.x + Math.sqrt(distX ** 2 + distY ** 2) * Math.cos((bullet.rotate-90) * Math.PI / 180);
            // let checkY = bullet.y + Math.sqrt(distX ** 2 + distY ** 2) * Math.sin((bullet.rotate-90) * Math.PI / 180);
            //
            // distX = Math.abs(zombie.x - checkX);
            // distY = Math.abs(zombie.y - checkY);

            let unrotatedCircleX = Math.cos((bullet.rotate - 90) * Math.PI / 180) * (zombie.x - bulletCenterX) -
                Math.sin((bullet.rotate - 90) * Math.PI / 180) * (zombie.y - bulletCenterY) + bulletCenterX;
            let unrotatedCircleY = Math.sin((bullet.rotate - 90)) * (zombie.x - bulletCenterX) +
                Math.cos((bullet.rotate - 90) * Math.PI / 180 * Math.PI / 180) * (zombie.y - bulletCenterY) + bulletCenterY;

            let closestX, closestY;

            if (unrotatedCircleX < bullet.x)
                closestX = bullet.x;
            else if (unrotatedCircleX > bullet.x + bullet.w)
                closestX = bullet.x + bullet.w;
            else
                closestX = unrotatedCircleX;

            if (unrotatedCircleY < bullet.y)
                closestY = bullet.y;
            else if (unrotatedCircleY > bullet.y + bullet.h)
                closestY = bullet.y + bullet.h;
            else
                closestY = unrotatedCircleY;


            let distance = findDistance({x: unrotatedCircleX, y: unrotatedCircleY}, {x: closestX, y: closestY});
            // let collide;
            // if ((distX > bullet.w / 2 + zombie.r || distY > bullet.h / 2 + zombie.r)) {
            //     collide = false;
            //
            // } else {
            //     let dx = distX - bullet.w / 2;
            //     let dy = distY - bullet.h / 2;
            //
            //     collide = distX <= bullet.w / 2 || distY <= bullet.h / 2 || dx * dx + dy * dy <= zombie.r * zombie.r;
            // }
            if (distance < zombie.r) {
                // if (collide) {
                zombie.hp.value -= player.bullet.damage;

                player.bullet.bullets.splice(bulletIndex, 1);

                if (zombie.hp.value <= 0) {
                    zombies.splice(zombieIndex, 1);
                    status.score.target += zombie.score;

                    generateParticles(zombie.x, zombie.y, 'blood');

                    if (!zombies.length) {
                        if (waveData[status.wave.value] !== 'infinite') {
                            nextWave();
                        }
                    }
                }
            }
        });
    })
}

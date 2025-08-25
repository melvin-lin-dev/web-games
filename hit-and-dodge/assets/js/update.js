function update() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    updatePlayer();
    updateBall();

    updatePlanet();
}

function updatePlayer() {
    players.forEach(player => {
        if (!player.fall.over) {
            if (!player.fall.animate) {
                player.checkFacing();
            }

            player.draw();
        }
    });
}

function updateBall() {
    ball.update();
    ball.draw();
}

function updatePlanet() {
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = 'rgb(220,180,50)';
    ctx.arc(cvs.width / 2, cvs.height / 2, planet.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}

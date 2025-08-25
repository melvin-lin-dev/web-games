function draw() {
    enemies.forEach((enemy, eIndex) => {
        enemy.draw();
        enemy.update();

        if (Helper.isOutOfBound(enemy)) {
            enemies.splice(eIndex, 1);
        }
    });

    player.draw();

    drawScore();
}

function drawScore() {
    ctx.save();
    ctx.beginPath();

    ctx.font = '17px arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 20);

    ctx.closePath();
    ctx.restore();
}

function drawGameOver() {
    ctx.save();
    ctx.beginPath();

    ctx.font = '80px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('GAMEOVER', cvs.width / 2, cvs.height / 2);

    ctx.font = '30px arial';
    ctx.fillStyle = 'rgb(50,180,200)';
    ctx.fillText('Final Score: ' + score, cvs.width / 2, cvs.height / 2 + 80);

    ctx.closePath();
    ctx.restore();
}

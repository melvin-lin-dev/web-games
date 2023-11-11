function checkHitZone(player) {
    let distance = getDistance(player, ball);

    let ballCheckPoint = getRotatedPoint(distance.xy, 0, player.x, player.y);

    distance = getDistance(player, ballCheckPoint);

    // SIMULATION
    // ctx.save();
    // ctx.beginPath();
    // if(!players.indexOf(player)){
    //     ctx.fillStyle = 'red';
    // }
    // ctx.arc(ballCheckPoint.x, ballCheckPoint.y, 10, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();

    if (distance.x > player.hitBoxSize.width / 2 + ball.r || distance.y > player.hitBoxSize.height / 2 + ball.r) {
        return false;
    }

    let dx = distance.x - player.hitBoxSize.width / 2;
    let dy = distance.y - player.hitBoxSize.height / 2;

    return distance.x <= player.hitBoxSize.width / 2 || distance.y <= player.hitBoxSize.height / 2 || dx * dx + dy * dy <= ball.r * ball.r;
}

function checkCollideZone() {
    players.forEach(player => {
        if (!player.fall.over) {
            let distance = getDistance(player, ball);

            let ballCheckPoint = getRotatedPoint(distance.xy, 0, player.x, player.y);

            distance = getDistance(player, ballCheckPoint);

            if (!(distance.x > playerProp.image.size.width / 2 + ball.r || distance.y > playerProp.image.size.height / 2 + ball.r)) {
                let dx = distance.x - playerProp.image.size.width / 2;
                let dy = distance.y - playerProp.image.size.height / 2;

                if (distance.x <= playerProp.image.size.width / 2 || distance.y <= playerProp.image.size.height / 2 || dx * dx + dy * dy <= ball.r * ball.r) {
                    player.collide();
                }
            }
        }
    })
}

function checkGameOver() {
    let alivePlayers = players.filter(player => !player.fall.over);

    if (alivePlayers.length === 1) {
        gameOverContainer.classList.add('active');

        gameOver = true;
        gameOverContainer.querySelector('.the-champion').innerHTML = alivePlayers[0].name;

        let deadPlayers = players.filter(player => player.fall.over);
        deadPlayers.forEach((player, index) => {
            gameOverContainer.querySelectorAll('.loser-container > div')[index].innerHTML = player.name;
        });
    }
}

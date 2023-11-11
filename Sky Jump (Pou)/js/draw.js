function draw() {
    drawPlatforms();

    drawPlayer();

    drawScore();
}

function drawPlayer() {
    if (move.left) player.x -= player.moveSpeed;
    if (move.right) player.x += player.moveSpeed;

    player.fallSpeed += gravity;
    // console.log(player.fallSpeed);
    player.y += player.fallSpeed;

    platforms.forEach(platform => {
        platform.update(player.fallSpeed);

        if (
            player.y + player.s >= platform.y &&
            player.y + player.s <= platform.y + platform.h + 10 &&
            player.x + player.s > platform.x &&
            player.x < platform.x + platform.w &&
            player.fallSpeed > 0
        ) {
            player.fallSpeed = 0;

            generatePlatform();
            generatePlatform();

            playerJump();
        }

        if (player.y < platform.y && !platform.scored) {
            score++;
            platform.scored = true;
        }
    });

    if (player.fallSpeed > 0) {
        player.y += player.fallSpeed;
    }

    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = 'rgb(240,200,0)';
    ctx.fillRect(player.x, player.y, player.s, player.s);

    ctx.closePath();
    ctx.restore();

    if (player.y > cvs.height) {
        gameOver = true;
    }
}

function drawPlatforms() {
    platforms.forEach((platform, index) => {
        platform.update();
        platform.draw();

        if (platform.y > cvs.height) {
            platforms.splice(index, 1);
        }
    })
}

function drawScore() {
    ctx.save();
    ctx.beginPath();

    ctx.font = '35px segoe ui';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 15, 40);
    ctx.strokeText(`Score: ${score}`, 15, 40);

    ctx.closePath();
    ctx.restore();
}

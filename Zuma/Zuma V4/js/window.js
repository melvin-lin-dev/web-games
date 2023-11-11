window.onload = () => {
    // generateBall();
    // setInterval(() => {
    // generateBall();
    // }, 500);

    starting();
};

window.onmousemove = (e) => {
    if (!gameOver) {
        let playerX = player.x + player.w / 2;
        let playerY = player.y + player.h / 2;

        let front = playerX - e.clientX;
        let side = playerY - e.clientY;

        player.rotate = getDegree(front, side);
    }
};

window.onkeydown = (e) => {
    let key = e.keyCode;

    if (key === 32) {
        // shoot();
    }
};

window.onclick = () => {
    player.shoot();

    gameStart = true;
};

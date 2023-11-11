window.onload = () => {
    // generateBall();
    // setInterval(() => {
    // generateBall();
    // }, 500);

    // starting();

    socket.emit('player_join');

    // socket.emit('player_join', {
    //     name: prompt('Input Username'),
    //     id: socket.id
    // });
};

window.onmousemove = (e) => {
    if (!gameOver && player) {
        let playerX = player.x + player.w / 2;
        let playerY = player.y + player.h / 2;

        let front = playerIndex * cvs.width + playerX - e.clientX;
        let side = playerY - e.clientY;

        // player.rotate = getDegree(front, side);

        socket.emit('player_rotate', {
            rotate: getDegree(front, side)
        });
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

    // gameStart = true;
};

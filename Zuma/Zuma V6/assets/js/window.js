window.onload = () => {
    initialization();

    menuContainer.classList.add('active');

    setTimeout(() => {
        loadMenu();
    }, 500);
};

window.onmousemove = (e) => {
    if (!gameOver && player) {
        let playerX = player.x + playerSize.width / 2;
        let playerY = player.y + playerSize.height / 2;

        let front = playerIndex * cvs.width + playerX - e.clientX;
        let side = playerY - e.clientY;

        socket.emit('player_rotate', {
            rotate: getDegree(front, side)
        });
    }
};

window.onkeyup = (e) => {
    let key = e.keyCode;

    if (key === 32) {
        player.swapBall();
    }
};

window.onclick = () => {
    if (!gameOver && player) {
        player.shoot();
    }
};

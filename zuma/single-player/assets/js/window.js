window.onload = () => {
    if(!localStorage.zuma){
        localStorage.zuma = JSON.stringify({
            maps: [],
            ranks: []
        })
    }

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

        let front = playerX - e.clientX;
        let side = playerY - e.clientY;

        player.rotate = getDegree(front, side)
        // socket.emit('player_rotate', {
        //     rotate: getDegree(front, side)
        // });
    }
};

window.onkeyup = (e) => {
    if (gameStart){
        let key = e.keyCode;
    
        if (key === 32) {
            document.activeElement.blur();
            player.swapBall();
        }
    }
};

window.onclick = () => {
    if (!gameOver && player) {
        player.shoot();
    }
};

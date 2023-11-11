function update() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    updateBoard();
    updatePlayers();
}

function updateBoard() {
    for (let key in hexagons) {
        hexagons[key].draw();
    }
}

function updatePlayers() {
    players.forEach(player => {
        player.drawHp();
    });

    players.forEach(player => {
        player.drawAttack();
    });

    players.forEach(player => {
        player.drawHexagon();
    });
}

window.onload = () => {
    generatePlayer();

    start();
};

window.onkeydown = e => {
    setMovement(e.keyCode, true);
};

window.onkeyup = e => {
    if (e.keyCode === 32) {
        player.shoot();
    }

    setMovement(e.keyCode, false);
};

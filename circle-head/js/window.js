window.onload = () => {
    reset();
    // gameStart();
};

window.onkeydown = (e) => {
    if (gameStart) {
        let key = e.keyCode;

        switch (key) {
            case 65:
            case 37:
                move.left = true;
                break;
            case 87:
            case 38:
                move.up = true;
                break;
            case 68:
            case 39:
                move.right = true;
                break;
            case 83:
            case 40:
                move.down = true;
                break;
        }
    }
};

window.onkeyup = (e) => {
    let key = e.keyCode;

    if (gameStart) {
        switch (key) {
            case 65:
            case 37:
                move.left = false;
                break;
            case 87:
            case 38:
                move.up = false;
                break;
            case 68:
            case 39:
                move.right = false;
                break;
            case 83:
            case 40:
                move.down = false;
                break;
            case 32:
                player.shoot();
                break;
        }
    }
};

window.onmousemove = (e) => {
    if (gameStart) {
        try {
            let side = player.y - e.clientY;
            let front = player.x - e.clientX;

            player.weapon.rotate = convertToDegree(front, side);
            player.updateBulletSpeed(front, side);
        } catch (e) {

        }
    }
};

window.onclick = (e) => {
    if (gameStart) {
        player.shoot();
    }
};

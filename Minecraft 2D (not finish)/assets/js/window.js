window.onload = () => {
    item = new Item();
};

window.onkeydown = (e) => {
    let key = e.keyCode;

    switch(key){
        case 65:
        case 37:
            move.left = true;
            break;
        case 68:
        case 39:
            move.right = true;
            break;
        case 69:
            inventory.toggleOpen();
            break;
    }
};

window.onkeyup = (e) => {
    let key = e.keyCode;

    switch(key){
        case 65:
        case 37:
            move.left = false;
            break;
        case 87:
        case 38:
            if(!player.fallSpeed) player.fallSpeed = -player.maxJump;
            break;
        case 68:
        case 39:
            move.right = false;
            break;
    }
};

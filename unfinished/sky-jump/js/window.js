let move = {
    left: false,
    right: false
};

window.onkeydown = (e) => {
    let key = e.keyCode;

    switch(key){
        case 37:
            move.left = true;
            break;
        case 39:
            move.right = true;
            break;
    }
};

window.onkeyup = (e) => {
    let key = e.keyCode;

    switch(key){
        case 37:
            move.left = false;
            break;
        case 39:
            move.right = false;
            break;
    }
};

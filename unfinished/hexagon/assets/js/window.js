window.onload = () => {
    start();
};

window.onkeyup = e => {
    let key = e.keyCode;

    if(key === 32){
        players[playerIndex].swapHexagon();
    }
};

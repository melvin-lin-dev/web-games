window.onload = () => {
    initialization();

    startContainer.classList.add('active');
};

window.onkeyup = (e) => {
    let key = e.keyCode;
    // console.log(key);

    if (players.length) {
        if (!players[playerIndex].fall.over) {
            switch (key) {
                case 32: // Hit
                    players[playerIndex].hit();
                    break;
                case 67: // Dodge
                    players[playerIndex].dodge();
                    break;
            }
        }
    }
};


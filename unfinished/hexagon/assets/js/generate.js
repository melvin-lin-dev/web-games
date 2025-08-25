function generateBoard() {
    let direction = 1;
    let minQuantity = 4;
    let maxQuantity = 7;
    let currentQuantity = minQuantity;

    while (direction === 1 || currentQuantity >= minQuantity) {
        let startX = cvs.width / 2 - (currentQuantity - 1) * hexagonSize.x;
        let hexagonY = cvs.height / 2 * (direction === 1 ? -1 : 1) + (maxQuantity - currentQuantity) * hexagonMargin.y;

        if (direction === 1) {
            for (let i = 0; i < currentQuantity; i++) {
                let hexagonX = startX + i * hexagonSize.x * 2;
                hexagonY = Math.abs(hexagonY);
                hexagons[Math.round(hexagonX) + '|' + Math.round(hexagonY)] = new Hexagon(hexagonX, hexagonY);
            }

            if (currentQuantity === maxQuantity) {
                direction = -1;
            }
        } else {
            for (let i = currentQuantity - 1; i >= 0; i--) {
                let hexagonX = startX + i * hexagonSize.x * 2;
                hexagons[Math.round(hexagonX) + '|' + Math.round(hexagonY)] = new Hexagon(hexagonX, hexagonY);
            }
        }


        currentQuantity += direction;
    }
}

function generatePlayers() {
    for (let i = 0; i < 2; i++) {
        players.push(new Player(i, 'testing'));
    }
}

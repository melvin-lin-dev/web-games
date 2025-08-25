let checkedHexagons = [];
let sameHexagons = [];
let directions = [[1, -1], [1, 0], [1, 1], [-1, -1], [-1, 0], [-1, 1]];

function checkSameHexagon(hexagon) {
    sameHexagons.push(hexagon);
    checkHexagonFlow(hexagon);

    if (sameHexagons.length >= 3) {
        sameHexagons.filter((hexagon, index) => sameHexagons[0].value < 7 && index).forEach(hexagon => {
            hexagon.value = 0;
            hexagon.generateDots();
        });

        players[playerIndex].attack.damage.value = sameHexagons[0].value;
        players[playerIndex].attack.damage.combo = sameHexagons.length - 2;

        players[playerIndex].attackOpponent();

        if (sameHexagons[0].value < 7) {
            sameHexagons[0].value++;
            sameHexagons[0].generateDots();
        } else {
            let tempHexagon = {...sameHexagons[0]};

            setTimeout(() => {
                setSurroundingDamages(tempHexagon);
            });

            sameHexagons.forEach(hexagon => {
                hexagon.value = 0;
                hexagon.generateDots();
            });
        }

        if (sameHexagons[0].value === 7) {
            let maxHexagon = sameHexagons[0];
            sameHexagons = [];
            checkedHexagons = [];
            checkSameHexagon(maxHexagon);
        }
    }

    sameHexagons = [];
    checkedHexagons = [];
}

function checkHexagonFlow(hexagon) {
    if (!hexagon || checkedHexagons.indexOf(hexagon) + 1) return false;
    if (!hexagon.value || hexagon.value !== sameHexagons[0].value) return false;

    if (sameHexagons[0] !== hexagon) {
        sameHexagons.push(hexagon);
    }

    checkedHexagons.push(hexagon);

    directions.forEach(direction => {
        let next = {
            x: hexagon.x + hexagonMargin.x / (direction[1] ? 2 : 1) * direction[0],
            y: hexagon.y + hexagonMargin.y * direction[1],
        };

        let nextHexagon = hexagons[Math.round(next.x) + '|' + Math.round(next.y)];

        checkHexagonFlow(nextHexagon);
    });
}

function setSurroundingDamages(hexagon) {
    let multiplier = 1;

    directions.forEach(direction => {
        let next = {
            x: hexagon.x + hexagonMargin.x / (direction[1] ? 2 : 1) * direction[0],
            y: hexagon.y + hexagonMargin.y * direction[1],
        };

        let nextHexagon = hexagons[Math.round(next.x) + '|' + Math.round(next.y)];

        if (nextHexagon) {
            if (nextHexagon.value) {
                players[playerIndex].setDamage(nextHexagon.value, 1, multiplier * 7, multiplier * 15);
                multiplier++;

                nextHexagon.value = 0;
                nextHexagon.generateDots();
            }
        }
    });
}

function checkEmptySpace() {
    let empty = false;

    let currentPlayerHexagon = players[playerIndex].hexagon;

    root:
        for (let key in hexagons) {
            let hexagon = hexagons[key];

            if (!hexagon.value) {
                switch (currentPlayerHexagon.list.length) {
                    case 1:
                        empty = true;
                        break root;
                    case 2:
                        let direction = [
                            currentPlayerHexagon.direction.x / Math.abs(currentPlayerHexagon.direction.x),
                            currentPlayerHexagon.direction.y ? currentPlayerHexagon.direction.y / Math.abs(currentPlayerHexagon.direction.y) : 0
                        ];

                        let next = {
                            x: hexagon.x + hexagonMargin.x / (direction[1] ? 2 : 1) * direction[0],
                            y: hexagon.y + hexagonMargin.y * direction[1],
                        };

                        let nextHexagon = hexagons[Math.round(next.x) + '|' + Math.round(next.y)];

                        if (nextHexagon) {
                            if (!nextHexagon.value) {
                                empty = true;
                                break root;
                            }
                        }
                        break;
                }
            }
        }

    if (!empty) {
        gameOver = playerIndex;
    }
}

function cvsClick(event) { // On Board Click
    let x = event.offsetX;
    let y = event.offsetY;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tile = gameGrid[row][col];

            if (x >= tile.x && y >= tile.y && x < tile.x + size && y < tile.y + size && !tile.color) {
                let enemy = turn === 'white' ? 'black' : 'white';

                if (tile.validMove) {
                    tile.clicked = true;
                    tile.r = 0;
                }

                checkFlow(col, row, enemy);
            }
        }
    }
}

function checkFlow(x, y, enemy) { // Check the flow
    let collectedTiles = [];

    dirs.forEach(dir => {
        let next = {x, y};
        let collectTiles = [];

        while (!gameOver) {
            next.x += dir[0];
            next.y += dir[1];

            if (checkOutOfBound(next.x, next.y)) {
                let nextTile = gameGrid[next.y][next.x];

                if (nextTile.color) {
                    if (nextTile.color === enemy) {
                        collectTiles.push({...next});
                    } else {
                        collectedTiles = [...collectedTiles, ...collectTiles];
                        break;
                    }
                } else {
                    collectTiles = [];
                    break;
                }
            } else {
                break;
            }
        }
    });

    if (collectedTiles.length) {
        if (!checking.status) {
            collectedTiles.push({x, y});
            changeEnemyColor(collectedTiles);
            clearValidMove();
            checkEmptyTile();
        } else {
            gameGrid[y][x].validMove = true;
            checking.valid = true;
        }
    }
}

function changeEnemyColor(collectedTiles) { // Change enemy color to the 'turn' color
    collectedTiles.forEach(tile => {
        gameGrid[tile.y][tile.x].color = turn;
    });

    scoreRefresh();
}

function checkEmptyTile() { // Check if there's still empty tile
    let empty = false;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            if (!gameGrid[row][col].color) {
                empty = true;
            }
        }
    }

    if (!empty) {
        gameOver = true;
    } else {
        checkValidMove();
    }
}

function checkValidMove() { // Check valid move on enemy
    checking.status = true;

    checkEveryMoves(turn);

    if (checking.valid) {
        checking.valid = false;
        changeTurn();
    } else {
        checkEveryMoves(turn === 'white' ? 'black' : 'white');
    }

    checkPlayable();

    checking.status = false;
}

function checkEveryMoves(color) { // Check move of all the tile that has not been chosen
    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            if (!gameGrid[row][col].color) {
                checkFlow(col, row, color);
            }
        }
    }
}

function clearValidMove() { // Clear all valid move to make new one later
    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            gameGrid[row][col].validMove = false;
        }
    }
}

function checkPlayable() { // Check if the game still playable or not
    let validMove = false;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tile = gameGrid[row][col];
            if (tile.validMove) {
                validMove = true;
            }
        }
    }

    if (!validMove) {
        gameOver = true;
    }
}

function checkOutOfBound(x, y) { // Check x & y out of bound or not
    return x >= 0 && y >= 0 && x < length && y < length;
}

function changeTurn() {
    turn = turn === 'white' ? 'black' : 'white';
}

function scoreRefresh() {
    score.white = 0;
    score.black = 0;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tile = gameGrid[row][col];

            if (tile.color) {
                score[tile.color]++;
            }
        }
    }

    for (let color in score) {
        document.getElementById(`${color}-score`).innerHTML = score[color];
    }
}
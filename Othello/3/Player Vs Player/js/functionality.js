function cvsClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tile = gameGrid[row][col];

            if (x >= tile.x && y >= tile.y && x < tile.x + size && y < tile.y + size && !tile.color) {
                let enemy = turn === 'black' ? 'white' : 'black';

                checkFlow(col, row, enemy);
            }
        }
    }
}

function checkFlow(x, y, enemy) {
    let collectedTiles = [];

    directions.forEach(dir => {
        let collectTiles = [];

        let next = {x, y};

        while (!gameOver) {
            next.x += dir[0];
            next.y += dir[1];

            if (checkOutOfBound(next.x * size, next.y * size)) {
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
            collectedTiles.push({x,y});
            changeEnemyColor(collectedTiles);
            checkEmpty();
        } else {
            checking.valid = true;
        }
    }
}

function changeEnemyColor(collectedTiles) {
    collectedTiles.forEach(tile => {
        gameGrid[tile.y][tile.x].color = turn;
    });
}

function checkOutOfBound(x, y) {
    return x >= 0 && y >= 0 && x + size <= cvs.width && y + size <= cvs.height;
}

function checkEmpty() {
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
        checkMoveExist();
    }
}

function checkMoveExist() {
    checking.status = true;
    let colors = [];

    outside:
    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tile = gameGrid[row][col];

            if (!tile.color) {
                checkFlow(col, row, turn);
            }else{
                colors.push(tile.color);
            }
        }
    }

    if (checking.valid) {
        changeTurn();
        checking.valid = false;
    }

    if(!(colors.indexOf('white') + 1 && colors.indexOf('black') + 1)){
        gameOver = true;
    }

    checking.status = false;
}

function changeTurn(){
    turn = turn === 'white' ? 'black' : 'white';
}
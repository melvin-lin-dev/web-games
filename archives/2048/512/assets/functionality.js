window.onkeydown = (e) => {
    let key = e.keyCode;

    switch (key) {
        case 37:
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    move([0,-1], row, col);
                }
            }
            generateBlock();
            break;
        case 38:
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    move([-1,0], row, col);
                }
            }
            generateBlock();
            break;
        case 39:
            for (let row = length - 1; row >= 0; row--) {
                for (let col = length - 1; col >= 0; col--) {
                    move([0,1], row, col);
                }
            }
            generateBlock();
            break;
        case 40:
            for (let row = length - 1; row >= 0; row--) {
                for (let col = length - 1; col >= 0; col--) {
                    move([1,0], row, col);
                }
            }
            generateBlock();
            break;
    }
}

function move(dir, y, x) {
    let tile = gameGrid[y][x];

    if(tile.value){
        let nextX = tile.x + dir[1];
        let nextY = tile.y + dir[0];

        while (!gameOver) {
            if (checkOutbound(nextX, nextY)) {
                let currentTile = gameGrid[nextY][nextX];

                if (currentTile.value) {
                    if (currentTile.value == tile.value) {
                        tile.value *= 2;
                        gameGrid[nextY][nextX].value = tile.value;
                        gameGrid[y][x].value = '';
                    } else {
                        gameGrid[nextY - dir[0]][nextX - dir[1]].value = tile.value;
                        if(y !== nextY - dir[0] || x !== nextX - dir[1]) gameGrid[y][x].value = '';
                    }

                    break;
                } else {
                    if (!checkOutbound(nextX + dir[1], nextY + dir[0])) {
                        gameGrid[nextY][nextX].value = tile.value;
                        gameGrid[y][x].value = '';
                        break;
                    }
                }
            } else {
                break;
            }

            nextX += dir[1];
            nextY += dir[0];
        }
    }
}

function generateRandomBlock(){
    while(true){
        let randRow = random(0,length);
        let randCol = random(0,length);
        let randTile = gameGrid[randRow][randCol];

        if(!randTile.value){
            randTile.value = 2;
            checkGenerate++;
        }

        if(checkGenerate >= 2){
            break;
        }
    }
}

function generateBlock(){
    while(!gameOver){
        let randRow = random(0,length);
        let randCol = random(0,length);
        let randTile = gameGrid[randRow][randCol];

        if(!randTile.value){
            randTile.value = 2;
            break;
        }
    }
}

function checkGameover(){
    let empty = false;

    for(let row = 0; row < length; row++){
        for(let col = 0; col < length; col++){
            if(!gameGrid[row][col].value) empty = true;
            if(gameGrid[row][col].value == winScore) gameOver = true;
        }
    }

    if(!empty){
        gameOver = true;
        console.log('a');
    }
}

function checkOutbound(x, y) {
    return x >= 0 && y >= 0 && x < length && y < length;
}
function refreshBoard() {
    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            let tileType = 'white';
            let tileColor = 'rgb(230,230,230)';

            if ((y % 2 === 0 && x % 2 === 1) || (y % 2 === 1 && x % 2 === 0)) {
                tileType = 'black';
                tileColor = 'rgb(90,90,90)';
            }

            let tile = gameBoard[y][x];

            tile.type = tileType;
            tile.color = tileColor;
            tile.dot = false;
            tile.eatable = false;
            // if (!tile.check) tile.eatable = false;

            selectedPawn = '';
        }
    }
}

function drawPawn() {
    let chessPosition = [
        [2, 3, 4, 0, 1, 4, 3, 2],
        // [5, 5, 5, 5, 5, 5, 5, 5]
    ];

    for (let y = 0; y < chessPosition.length; y++) {
        for (let x = 0; x < chessPosition[y].length; x++) {
            let chessX = x * tileSize;
            let chessY = y * tileSize;
            let chessType = chessPosition[y][x];
            let chessColor = 0;

            pawns[y][x] = new Pawn(chessX, chessY, chessType, chessColor);
        }
    }

    // let tempChessPosition = [0];
    // chessPosition[0] = chessPosition[1];
    // chessPosition[1] = tempChessPosition;

    for (let y = chessPosition.length - 1; y >= 0; y--) {
        // console.log(y);
        for (let x = chessPosition[y].length - 1; x >= 0; x--) {
            let newY = tileLength - y - 1;
            let chessX = x * tileSize;
            let chessY = newY * tileSize;
            let chessType = chessPosition[y][x];
            let chessColor = 1;
            //
            // if(x === 3 && chessType === 5){
            //     // continue;
            //     chessType = 3;
            //     newY = 2;
            //     chessY = newY * tileSize;
            //     chessX = 2 * tileSize;
            //     x = 2;
            // }
            if(chessType === 5){
                continue;
            }
            // if(chessType === 3 || chessType === 4 || chessType === 0){
            //     continue;
            // }
            //

            pawns[newY][x] = new Pawn(chessX, chessY, chessType, chessColor);
        }
    }
}

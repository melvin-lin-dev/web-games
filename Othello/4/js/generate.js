function generateGrid() { // Generate grid for the game
    for (let row = 0; row < length; row++) {
        gameGrid.push([]);
        for (let col = 0; col < length; col++) {
            gameGrid[row].push(new Tile(col * size, row * size));
        }
    }

    generateStartingTiles();
}

function generateStartingTiles(){ // Generate starting tiles
    let startingTiles = [['white','black'],['black','white']];

    for(let row = 0; row < 2; row++){
        for(let col = 0; col < 2; col++){
            let startIndex = length / 2 - 1;
            let tile = gameGrid[startIndex + row][startIndex + col];
            tile.color = startingTiles[row][col];
        }
    }
}
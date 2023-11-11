function generateGrid(){
    for(let y = 0; y < length; y++){
        gameGrid.push([]);
        for(let x = 0; x < length; x++){
            gameGrid[y].push(new Tile(x * size, y * size));
        }
    }

    generateStartingTile();
}

function generateStartingTile(){
    let startColors = [['black','white'],['white','black']];

    for(let y = 0; y < 2; y++){
        for(let x = 0; x < 2; x++){
            let startX = length / 2 - 1 + x;
            let startY = length / 2 - 1 + y;

            gameGrid[startY][startX].color = startColors[y][x];
        }
    }
}
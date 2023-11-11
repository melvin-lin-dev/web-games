function generateGrid() {
    for (let row = 0; row < length; row++) {
        gameGrid.push([]);
        for (let col = 0; col < length; col++) {
            gameGrid[row].push(new Tile(col, row));
        }
    }
}

function drawBoard(){
    for(let row = 0; row < length; row++){
        for(let col = 0; col < length; col++){
            gameGrid[row][col].draw();
        }
    }
}

function drawLine(){
    for(let i = 0; i <= length; i++){
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = 'rgb(190,170,160)';

        ctx.moveTo(0,i*size);
        ctx.lineTo(cvs.width,i*size);

        ctx.moveTo(i*size,0);
        ctx.lineTo(i*size,cvs.height);

        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
}
function drawLines() { //Draw Board Grids / Lines
    for (let i = 0; i <= length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, cvs.height);
        ctx.moveTo(0, i * size);
        ctx.lineTo(cvs.width, i * size);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

function drawObjects(){ //Draw Tiles
    for(let row = 0; row < length; row++){
        for(let col = 0; col < length; col++){
            let tile = gameGrid[row][col];
            tile.draw();
        }
    }
}
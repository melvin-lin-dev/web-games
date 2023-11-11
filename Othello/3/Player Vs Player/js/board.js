function drawGrid() {
    for (let i = 0; i <= length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, cvs.height);
        ctx.moveTo(0, i * size);
        ctx.lineTo(cvs.width, i * size);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

function drawObjects() {
    for (let y = 0; y < length; y++) {
        for (let x = 0; x < length; x++) {
            let tile = gameGrid[y][x];
            tile.draw();
        }
    }
}
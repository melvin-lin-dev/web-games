function drawBoard() {
    for (let row = 0; row < length; row++) {
        gameGrid.push([]);
        for (let col = 0; col < length; col++) {
            gameGrid[row].push('');
        }
    }
}

function drawLine() {
    ctx.save();
    ctx.beginPath();
    for (let row = 0; row < length; row++) {
        ctx.moveTo(0, row * size);
        ctx.lineTo(cvs.width, row * size);
    }

    for (let col = 0; col < length; col++) {
        ctx.moveTo(col * size, 0);
        ctx.lineTo(col * size, cvs.height);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawLineGroup() {
    ctx.save();
    ctx.beginPath();
    for (let row = 0; row <= length / 3; row++) {
        ctx.moveTo(0, row * size * 3);
        ctx.lineTo(cvs.width, row * size * 3);
    }

    for (let col = 0; col <= length / 3; col++) {
        ctx.moveTo(col * size * 3, 0);
        ctx.lineTo(col * size * 3, cvs.height);
    }
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawText() {
    ctx.beginPath();
    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let text = gameGrid[row][col];

            ctx.font = '30px segoe ui';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            ctx.save();
            if (checkDuplicate(row,col)) {
                ctx.fillStyle = 'red';
            }
            ctx.fillText(text, col * size + size / 2, row * size + size / 2);
            ctx.restore();
        }
    }
    ctx.closePath();
}
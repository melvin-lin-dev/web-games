let mouseDown = false;

function cvsMouseDown(e) {
    mouseDown = true;
}

function cvsMouseUp(e) {
    mouseDown = false;

    let x = e.clientX;
    let y = e.clientY;

    blocks.forEach((blockRow) => {
        blockRow.forEach((block) => {
            let blockCenterX = block.x + blockSize / 2;
            let blockCenterY = block.y + blockSize / 2;

            let checkHandRange = player.x - player.handRange <= blockCenterX && player.y - player.handRange <= blockCenterY && player.x + player.w + player.handRange >= blockCenterX && player.y + player.h + player.handRange >= blockCenterY;

            if (x > block.x && y > block.y && x <= block.x + blockSize && y <= block.y + blockSize && checkHandRange) {
                block.hp = block.maxHp;
            }
        })
    })
}

function cvsMouseMove(e) {
    let x = e.clientX;
    let y = e.clientY;

    blocks.forEach((blockRow) => {
        blockRow.forEach((block) => {
            let blockCenterX = block.x + blockSize / 2;
            let blockCenterY = block.y + blockSize / 2;

            let checkHandRange = player.x - player.handRange <= blockCenterX && player.y - player.handRange <= blockCenterY && player.x + player.w + player.handRange >= blockCenterX && player.y + player.h + player.handRange >= blockCenterY;

            if (x > block.x && y > block.y && x <= block.x + blockSize && y <= block.y + blockSize && checkHandRange) {
                block.hover = true;
            } else {
                block.hover = false;
                block.hp = block.maxHp;
            }
        });
    });
}

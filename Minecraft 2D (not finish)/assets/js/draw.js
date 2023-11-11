function draw() {
    blocks.forEach((blockRow, y) => {
        blockRow.forEach((block, x) => {
            block.draw();
        })
    });

    player.draw();

    drops.forEach(drop => {
        drop.draw();
    });
}

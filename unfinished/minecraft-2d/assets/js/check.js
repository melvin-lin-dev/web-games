function checkCollisions() {
    blocks.forEach((blockRow, y) => {
        blockRow.forEach((block, x) => {
            if (player.x + player.w - 10 >= block.x && player.y + blockSize * 2 >= block.y && player.x + 10 <= block.x + blockSize && player.y <= block.y + blockSize && !item[block.type].block.walkable) {
                if (player.fallSpeed >= player.fallSpeedLimit) player.stats.hp -= player.fallSpeed - player.fallSpeedLimit;
                player.y = block.y - blockSize * 2;
                player.fallSpeed = 0;
            }

            drops.forEach(drop => {
                if (drop.x + drop.s >= block.x && drop.y + drop.s >= block.y && drop.x <= block.x + blockSize && drop.y <= block.y + blockSize && !block.walkable && !drop.drop) {
                    drop.y = block.y - drop.s;
                    drop.dropped();
                }
            });
        });
    });
}

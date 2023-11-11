function generateBlocks() {
    for (let y = 0; y < yBlocks; y++) {
        blocks.push([]);
        for (let x = 0; x < xBlocks; x++) {
            let type = '';

            if (y > startLand) {
                if (y < 5 + startLand) {
                    let rand = Math.random();
                    if (rand < 0.5 * (y - startLand)) {
                        type = 'dirt';
                    } else {
                        type = 'sky';
                    }
                } else if (Math.random() < 0.1 * y) {
                    type = 'stone';
                }
            } else {
                type = 'sky';
            }

            blocks[y].push(new Block(x, y, type));
        }
    }

    generateTree();
}

function generateTree() {
    blocks.forEach((blockRow, y) => {
        blockRow.forEach((block, x) => {
            if (!checkOutOfBounds(x, y - 1)) {
                if (block.type === 'dirt' && blocks[y - 1][x].type === 'sky' && Math.random() < 0.1) {
                    let height = random(1, 3);

                    for (let i = 1; i <= height; i++) {
                        blocks[y - i][x].type = 'wood';

                        if (i === height) {
                            generateLeaves(x, y - i);
                        }
                    }
                }
            }
        });
    });
}

function generateLeaves(x, y) {
    let size = random(4, 6);

    let roundedType = random(0, 1) ? 'ceil' : 'floor';

    while (size > 0) {
        y--;

        for (let i = 1; i <= size; i++) {
            let leavesX = x - Math[roundedType](size / 2) + i;
            if (!checkOutOfBounds(leavesX, y)) {
                blocks[y][leavesX].type = 'leaves';
            }
        }

        size -= 1;
    }
}

function generateImage(type, name) {
    let image = new Image();
    image.src = `${assets.image[type]}/${name}`;
    return image;
}

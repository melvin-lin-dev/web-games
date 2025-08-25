class Player {
    constructor(x, y) {
        // this.x = random(10, yBlocks - 10);
        this.x = cvs.width / 2;
        this.y = cvs.height / 2;
        this.w = blockSize;
        this.h = blockSize * 2;

        this.handRange = (blockSize + blockSize / 2) * 2;
        this.pickupRange = blockSize + blockSize / 2;

        this.image = new Image();
        this.image.src = `${assets.image.skin}/steve.png`;

        this.walkSpeed = 5;

        this.gravity = .5;
        this.fallSpeed = 0;
        this.fallSpeedLimit = 15;

        this.maxJump = 10;

        this.maxHp = 10;

        this.stats = {
            armor: 0,
            hp: this.maxHp,
        };

        let heartScale = .123;

        this.hp = {
            location: {
                x: 0,
                y: 0
            },
            frame: 3,
            image: generateImage('status', 'heart.png'),
            size: {
                sw: 193,
                sh: 182,
                w: 193 * heartScale,
                h: 182 * heartScale
            }
        };

        setTimeout(() => {
            let inventoryRect = document.querySelector('.inventory-container .main-inventory').getBoundingClientRect();
            this.hp.location.x = inventoryRect.left;
            this.hp.location.y = inventoryRect.top - this.hp.size.h - 5;
        })
    }

    move() {
        if (move.left || move.right) {
            if (move.right && player.x > cvs.width / 2 && blocks[0][0].x === 0 || move.left && player.x < cvs.width / 2 && blocks[0][blocks[0].length - 1].x === cvs.width) {
                this.moveObjects(1);
            }

            if (blocks[0][0].x === 0 || blocks[0][blocks[0].length - 1].x === cvs.width) {
                if (move.left) {
                    if (player.x - this.walkSpeed < 0) {
                        player.x = 0;
                    } else {
                        player.x -= this.walkSpeed;
                    }
                } else {
                    if (player.x + player.w + this.walkSpeed > cvs.width) {
                        player.x = cvs.width - player.w;
                    } else {
                        player.x += this.walkSpeed
                    }
                }
            } else {
                if (move.left) {
                    let blockSpeed = blocks[0][0].x + this.walkSpeed > 0 ? 0 - blocks[0][0].x : this.walkSpeed;
                    this.moveObjects(blockSpeed);
                } else if (move.right) {
                    let blockSpeed = blocks[0][blocks[0].length - 1].x - this.walkSpeed < cvs.width ? blocks[0][blocks[0].length - 1].x - cvs.width : this.walkSpeed;
                    this.moveObjects(-blockSpeed);
                }
            }
        }

        if (this.fallSpeed && blocks[blocks.length - 1][blocks[0].length - 1].y > cvs.height) {
            this.moveObjects(-this.fallSpeed, 'y');
        }

        this.y += this.fallSpeed;
        this.fallSpeed += this.gravity;
    }

    moveObjects(defaultSpeed = (move.left ? 1 : -1) * this.walkSpeed, type = 'x') {
        blocks.forEach((blockRow, y) => {
            blockRow.forEach((block, x) => {
                block[type] += defaultSpeed;
            });
        });

        drops.forEach(drop => {
            drop[type] += defaultSpeed;
        });
    }


    pickupItem() {
        blocks.forEach((blockRow, y) => {
            blockRow.forEach((block, x) => {
                let blockCenterX = block.x + blockSize / 2;
                let blockCenterY = block.y + blockSize / 2;

                drops.forEach((drop, index) => {
                    let checkPickupRange = player.x - player.pickupRange <= blockCenterX && player.y - player.pickupRange <= blockCenterY && player.x + player.w + player.pickupRange >= blockCenterX && player.y + player.h + player.pickupRange >= blockCenterY;

                    if (drop.x + drop.s >= block.x && drop.y + drop.s >= block.y && drop.x <= block.x + blockSize && drop.y <= block.y + blockSize && checkPickupRange) {
                        let speedX = (player.x + player.w / 2 - drop.x) / drop.pickupSpeed;
                        let speedY = (player.y + player.h / 2 - drop.y) / drop.pickupSpeed;

                        drop.x += speedX;
                        drop.y += speedY;

                        let padding = 20;

                        if (drop.x + drop.s + padding >= player.x && drop.y + drop.s + padding * 2 >= player.y && drop.x <= player.x + blockSize - padding && drop.y <= player.y + blockSize * 2 - padding) {
                            drops.splice(index, 1);
                            inventory.pickup(drop);
                        }
                    }
                });
            });
        });
    }

    draw() {
        this.pickupItem();

        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        ctx.restore();

        this.drawHp();
    }

    drawHp() {
        for (let i = 0; i < this.maxHp; i++) {
            let currentHeartState = 0;

            if (i <= this.stats.hp) {
                if (Math.floor(this.stats.hp) === i && (this.stats.hp - i) % 1) {
                    currentHeartState = 1;
                } else {
                    currentHeartState = 2;
                }
            }

            ctx.save();
            ctx.drawImage(this.hp.image, currentHeartState * this.hp.size.sw, 0, this.hp.size.sw, this.hp.size.sh, i * this.hp.size.w + this.hp.location.x, this.hp.location.y, this.hp.size.w, this.hp.size.h);
            ctx.restore();
        }
    }
}

class Block {
    constructor(x, y, type) {
        this.x = x * blockSize;
        this.y = (y - startLand + 7) * blockSize;

        this.maxHp = 5;
        this.hp = this.maxHp;

        this.type = type;

        this.breakImage = new Image();
        this.breakImage.src = `./assets/images/other/break.png`;

        this.hover = false;
        this.breakingTime = 0;
    }

    setBlock(newBlock) {
        this.type = convertImageToType(newBlock);
    }

    clearBlock() {
        this.type = 'sky';
    }

    click() {
        this.breakingTime++;

        if (this.breakingTime % (item[this.type].block.breakTime) === 0 && this.type !== 'sky') {
            this.hp--;

            if (this.hp <= 0) {
                drops.push(new Drop(this.x + blockSize / 2, this.y + blockSize / 2, this.type));

                this.clearBlock();
            }
        }

        let slot = document.querySelector('.inventory .active');

        if (slot) {
            let item = slot.children[0];

            if (item) {
                this.setBlock(item);
                item.remove();
                slot.classList.remove('active');
            }
        }
    }

    draw() {
        if (this.hover && mouseDown) {
            this.click();
        }

        ctx.save();
        ctx.drawImage(item[this.type].block.image, this.x, this.y, blockSize, blockSize);
        ctx.drawImage(this.breakImage, (this.maxHp - this.hp) * this.breakImage.height, 0, blockSize * 10, blockSize * 10, this.x, this.y, blockSize, blockSize);

        if (this.hover) {
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, blockSize, blockSize);
        }
        ctx.restore();
    }
}

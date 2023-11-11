class Drop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        this.speedX = 3;
        let dirs = [-1, 1];
        this.speedX *= dirs[random(0, 1)];

        this.pickupSpeed = 50;

        this.s = blockSize / 3;
        this.type = type;
        this.image = item[type].drop.image;

        this.drop = false;
        this.isUp = true;
        this.fallSpeed = 0;
        this.gravity = player.gravity;

        this.maxHeight = 0;
        this.minHeight = 0;

        this.speedAnimation = .6;
    }

    dropped() {
        this.drop = true;
        this.y -= this.s + 5;
        this.maxHeight = this.y - 25;
        this.minHeight = this.y - 5;
    }

    draw() {
        if (this.drop) {
            if (this.isUp && this.y > this.maxHeight) {
                this.y -= this.speedAnimation;

                if (this.y < this.maxHeight) {
                    this.y = this.maxHeight;
                    this.isUp = !this.isUp;
                }
            } else if (!this.isUp && this.y < this.minHeight) {
                this.y += this.speedAnimation;

                if (this.y > this.minHeight) {
                    this.y = this.minHeight;
                    this.isUp = !this.isUp;
                }
            }
        } else {
            this.x += this.speedX;
            this.y += this.fallSpeed;
            this.fallSpeed += this.gravity;
        }

        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.s, this.s);
        ctx.restore();
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 50;

        this.speed = 7;
        this.bullets = [];
    }

    shoot() {
        this.bullets.push(new Bullet(this.x + this.w, this.y + this.h / 2, 1));
    }

    draw() {
        player.bullets.forEach((bullet, bIndex) => {
            bullet.draw();
            bullet.update();

            if (Helper.isOutOfBound(bullet)) {
                this.bullets.splice(bIndex, 1);
            }
        });

        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = 'rgb(50,180,200)';
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.closePath();
        ctx.restore();
    }
}

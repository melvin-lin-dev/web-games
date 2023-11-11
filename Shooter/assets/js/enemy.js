class Enemy {
    constructor() {
        this.w = 40;
        this.h = 40;
        this.x = cvs.width;
        this.y = Helper.random(this.h, cvs.height - this.h);

        this.speed = 3;
        this.bullets = [];

        this.isDead = false;

        setInterval(() => {
            this.shoot();
        }, 2000);
    }

    update() {
        this.x -= this.speed;
    }

    shoot() {
        this.bullets.push(new Bullet(this.x + this.w, this.y + this.h / 2, -1));
    }

    draw() {
        this.bullets.forEach((bullet, bIndex) => {
            bullet.draw();
            bullet.update();

            if (Helper.isOutOfBound(bullet)) {
                this.bullets.splice(bIndex, 1);
            }
        });

        if(!this.isDead){
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = 'rgb(220,80,80)';
            ctx.fillRect(this.x, this.y, this.w, this.h);

            ctx.closePath();
            ctx.restore();
        }
    }
}

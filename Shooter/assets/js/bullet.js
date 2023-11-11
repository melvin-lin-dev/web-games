class Bullet {
    constructor(x, y, direction) {
        this.w = 50;
        this.h = 10;

        this.x = x + (direction === 1 ? 0 : -this.w);
        this.y = y - this.h / 2;

        this.dir = direction;
        this.speed = 5;
    }

    update() {
        this.x += this.dir * this.speed;
    }

    draw() {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.closePath();
        ctx.beginPath();
    }
}

class Bullet {
    constructor(x, y, w, h, color, rotate) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rotate = rotate;
        this.color = color;

        this.speed = 10;
    }

    update() {
        this.x += this.speed * Math.cos((this.rotate-90) * Math.PI / 180);
        this.y += this.speed * Math.sin((this.rotate-90) * Math.PI / 180);
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.rotate((this.rotate - 90) * Math.PI / 180);
        ctx.rect(0, -this.h / 2, this.w, this.h);
        ctx.fill();
        ctx.strokeStyle = 'rgb(255,220,0)';
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

class Platform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = platformSize.width;
        this.h = platformSize.height;

        this.color = 'rgb(100,230,0)';

        this.scored = false;
    }

    update(speed) {
        if (speed < 0) {
            let currentSpeed = Math.abs(speed);
            this.y += currentSpeed;
            distance += currentSpeed;
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.closePath();
        ctx.restore();
    }
}

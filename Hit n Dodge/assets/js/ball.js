class Ball {
    constructor(rotation, direction) {
        this.x = this.y = null;

        this.rotation = rotation;
        this.direction = direction;

        this.r = 13;
        this.speed = {
            value: 1,
            default: 1,
            increment: 0.1
        };

        // this.rotate = {
        //     value: 0,
        //     speed: 3
        // };

        this.margin = 35;
    }

    update() {
        let point = getRotatedPoint(planet.r + this.margin, this.rotation - 90, cvs.width / 2, cvs.height / 2);
        this.x = point.x;
        this.y = point.y;

        this.rotation += this.direction * this.speed.value;

        // this.rotate.value += this.rotate.speed;
    }

    draw() {
        ctx.save();
        ctx.beginPath();

        ctx.translate(this.x, this.y);
        // ctx.rotate(degToRad(this.rotate.value));
        ctx.fillStyle = 'white';
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    }

    hit() {
        this.direction *= -1;
        this.speed.value += this.speed.increment;
    }
}

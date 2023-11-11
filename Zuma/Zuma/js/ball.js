class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        this.shoot = {
            speed: 10,
            rotate: 0
        };

        this.percent = 0;
        // this.speed = 1;
    }

    update() {
        // set the animation position (0-100)
        let collide = false;

        balls.forEach(ball => {
            if (checkCircleCollision(ball, this) && ball.percent !== this.percent) {
                // collide = true;
            }
        });

        if (!collide) {
            this.percent += ball.speed;
        }

        if (this.percent < 0) {
            this.percent = 0;
            ball.speed *= -1;
        }
        if (this.percent > end.value) {
            this.percent = end.value;
            // ball.speed *= -1;
        }
    }

    shootUpdate() {
        this.x += this.shoot.speed * degreeToRadian('cos', this.shoot.rotate);
        this.y += this.shoot.speed * degreeToRadian('sin', this.shoot.rotate);
    }

    draw() {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, ball.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.closePath();
    }
}

class Player {
    constructor(x, y) {
        let scale = 0.6;
        this.w = frogImage.width * scale;
        this.h = frogImage.height * scale;

        this.x = x - this.w / 2;
        this.y = y - this.h / 2;

        this.ball = {
            current: new Ball(randomBall()),
            future: new Ball(randomBall())
        };

        this.rotate = 0;
        this.rotateSpeed = 40;
    }

    draw() {
        if(gameOver) this.rotate += this.rotateSpeed;

        let playerX = this.x + this.w / 2;
        let playerY = this.y + this.h / 2;

        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.arc(playerX, playerY, this.w / 2 + 14, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgb(180,180,180)';
        ctx.lineWidth = 8;
        ctx.fill();
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        ctx.save();

        ctx.translate(playerX, playerY);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.drawImage(frogImage, -this.w / 2, -this.h / 2, this.w, this.h);

        ctx.restore();

        let ballX = this.x + this.w / 2;
        let ballY = this.y + this.h / 2;

        ctx.save();

        let currentRotate = this.rotate + 90;

        let currentBallMarginRadius = -45;
        this.ball.current.x = ballX + currentBallMarginRadius * degreeToRadian('cos', currentRotate);
        this.ball.current.y = ballY + currentBallMarginRadius * degreeToRadian('sin', currentRotate);
        this.ball.current.draw(.7);

        ctx.restore();

        ctx.save();

        let futureBallMarginRadius = 36;
        this.ball.future.x = ballX + futureBallMarginRadius * degreeToRadian('cos', currentRotate);
        this.ball.future.y = ballY + futureBallMarginRadius * degreeToRadian('sin', currentRotate);
        this.ball.future.draw(.5);

        ctx.restore();
    }

    shoot() {
        if(!gameOver){
            this.ball.current.rotate = this.rotate - 90;

            shootBalls.push(this.ball.current);

            this.ball.current = this.ball.future;
            this.ball.future = new Ball(randomBall());
        }
    }
}

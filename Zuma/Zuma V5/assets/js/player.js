class Player {
    constructor(id, x, y) {
        // this.name = name;
        this.id = id;

        let scale = 0.55;
        this.w = frogImage.width * scale;
        this.h = frogImage.height * scale;

        this.x = x - this.w / 2;
        this.y = y - this.h / 2;

        this.ball = {
            current: null,
            future: null
        };

        this.rotate = 0;
        this.rotateSpeed = 40;

        this.shootCoolDown = {
            value: 0,
            default: 20
        };
    }

    loadBall() {
        socket.emit('player_load_ball', {
            current: this.randomExistBall(),
            future: this.randomExistBall()
        });
        // this.ball.current = new Ball(this.randomExistBall());
        // this.ball.future = new Ball(this.randomExistBall());
    }

    randomExistBall() {
        return randomBall();
        let existTypes = [];

        balls.forEach(trainBall => {
            if (!(existTypes.indexOf(trainBall.type) + 1)) {
                existTypes.push(trainBall.type);
            }
        });

        return existTypes[random(0, existTypes.length - 1)];
    }

    draw(ctx) {
        if (gameOver) this.rotate += this.rotateSpeed;

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

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '30px arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.id, playerX, playerY);

        if (gameStart && this.ball.current) {
            let ballX = this.x + this.w / 2;
            let ballY = this.y + this.h / 2;

            ctx.save();

            let currentRotate = this.rotate + 90;

            let currentBallPoint = getRotationPosition(-45, currentRotate, ballX, ballY);
            this.ball.current.x = currentBallPoint.x;
            this.ball.current.y = currentBallPoint.y;
            this.ball.current.draw(ctx, .7);

            ctx.restore();

            ctx.save();

            let futureBallPoint = getRotationPosition(36, currentRotate, ballX, ballY);
            this.ball.future.x = futureBallPoint.x;
            this.ball.future.y = futureBallPoint.y;
            this.ball.future.draw(ctx, .5);

            ctx.restore();
        }

        this.shootCoolDown.value--;
    }

    shoot() {
        if (!gameOver && gameStart && this.shootCoolDown.value <= 0) {
            // this.ball.current.rotate.value = this.rotate - 90;

            // shootBalls.push(this.ball.current);

            // this.ball.current = this.ball.future;
            // this.ball.future = new Ball(this.randomExistBall());

            socket.emit('player_shoot', {
                rotate: this.rotate - 90,
                future: this.randomExistBall()
            });

            // sound('shoot');

            this.shootCoolDown.value = this.shootCoolDown.default;
        }
    }
}

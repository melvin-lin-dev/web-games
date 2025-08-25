class Player {
    constructor(name, x, y) {
        // this.name = name;
        nameEl.innerHTML = name;

        this.x = x - playerSize.width / 2;
        this.y = y - playerSize.height / 2;

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
        this.ball.current = new Ball(this.randomExistBall());
        this.ball.future = new Ball(this.randomExistBall());
        // socket.emit('player_load_ball', {
        //     current: this.randomExistBall(),
        //     future: this.randomExistBall()
        // });
    }

    randomExistBall() {
        return randomBall(); //temporary
        let existTypes = [];

        balls.forEach(trainBall => {
            if (!(existTypes.indexOf(trainBall.type) + 1)) {
                existTypes.push(trainBall.type);
            }
        });

        return existTypes[random(0, existTypes.length - 1)];
    }

    draw() {
        if (gameOver) this.rotate += this.rotateSpeed;

        let playerX = this.x + playerSize.width / 2;
        let playerY = this.y + playerSize.height / 2;

        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.arc(playerX, playerY, playerSize.width / 2 + 14, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgb(180,180,180)';
        ctx.lineWidth = 8;
        ctx.fill();
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        ctx.save();

        ctx.translate(playerX, playerY);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.drawImage(frogImage, -playerSize.width / 2, -playerSize.height / 2, playerSize.width, playerSize.height);

        ctx.restore();

        if (gameStart && this.ball.current) {
            let ballX = this.x + playerSize.width / 2;
            let ballY = this.y + playerSize.height / 2;

            ctx.save();

            let currentRotate = this.rotate + 90;

            let currentBallPoint = getRotationPosition(-45, currentRotate, ballX, ballY);
            this.ball.current.x = currentBallPoint.x;
            this.ball.current.y = currentBallPoint.y;
            this.ball.current.draw(.7);

            ctx.restore();

            ctx.save();

            let futureBallPoint = getRotationPosition(36, currentRotate, ballX, ballY);
            this.ball.future.x = futureBallPoint.x;
            this.ball.future.y = futureBallPoint.y;
            this.ball.future.draw(.5);

            ctx.restore();
        }

        //Player Name
        // ctx.save();
        // ctx.beginPath();

        // let rectHeight = 40;
        // let margin = 15;

        // ctx.fillStyle = 'rgb(50, 170, 50)';
        // ctx.rect(0, 0, window.innerWidth, rectHeight);
        // ctx.fill();
        // ctx.stroke();
        
        // ctx.textBaseline = 'middle';
        // ctx.font = 'bold 30px arial';
        // ctx.fillStyle = 'white';
        // ctx.fillText(this.name, margin, rectHeight / 2);

        // ctx.closePath();
        // ctx.restore();

        this.shootCoolDown.value--;
    }

    shoot() {
        if (!gameOver && gameStart && this.shootCoolDown.value <= 0) {
            this.ball.current.rotate.value = this.rotate - 90;
            shootBalls.push(this.ball.current);

            this.ball.current = this.ball.future;
            this.ball.future = new Ball(this.randomExistBall());

            sound('shoot');

            this.shootCoolDown.value = this.shootCoolDown.default;
        }
    }

    swapBall(){
        let tempCurrentBall = player.ball.current;
        player.ball.current = player.ball.future;
        player.ball.future = tempCurrentBall;
    }
}

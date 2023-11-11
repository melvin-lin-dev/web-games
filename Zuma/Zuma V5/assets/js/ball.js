class Ball {
    constructor(id, color = '') {
        this.id = id;

        this.x = 0;
        this.y = 0;
        this.type = color ? color : randomBall();

        this.percent = 0;
        this.direction = 1;

        this.push = {
            target: 0,
            speed: 20,
            direction: 0
        };

        this.rotate = {
            value: 0,
            currentDifference: 0,
            direction: 0,
            speed: 10,
            collide: null,
            target: null
        };
    }

    update() {
        if ((this.push.target > 0 && this.push.direction === 1) || (this.push.target < 0 && this.push.direction === -1)) {
            let speed = this.push.speed / scale;
            let check = this.push.direction === 1 ? this.push.target - speed <= 0 : this.push.target - speed >= 0;
            let pushSpeed = this.push.direction * (check ? this.push.target : speed);

            this.percent += pushSpeed;
            this.push.target -= pushSpeed;

            if (!this.push.target && this.push.direction === 1) {
                let frontBallIndex = balls[this.id].indexOf(this) - 1;
                let frontBall = balls[this.id][frontBallIndex];

                if (frontBall) {
                    let percentDifference = frontBall.percent - this.percent;

                    if (percentDifference < ball.margin) {
                        let pushMargin = ball.margin - percentDifference;

                        for (let i = frontBallIndex; i >= 0; i--) {
                            balls[this.id][i].push.target = pushMargin;
                        }
                    }
                }
            }
        }

        let speed = ball.speed;

        if (startingPhase) {
            speed = ball.startSpeed;
        } else if (this.direction === -1) {
            speed = ball.reverseSpeed;
            speed *= scoreMultiplier[this.id];
        }

        this.percent += this.direction * speed / scale;

        this.updatePosition();
    }

    updatePosition() {
        let point = loadLocation(this.percent);
        this.x = point.x;
        this.y = point.y;
    }

    shootUpdate() {
        let currentPoint = getRotationPosition(ball.shootSpeed, this.rotate.value);
        this.x += currentPoint.x;
        this.y += currentPoint.y;
    }

    directionMode(command) {
        if (command === 'stop') {
            this.direction = 0;
        } else if (command === 'normal') {
            this.direction = 1;
        } else if (command === 'reverse') {
            this.direction = -1;
        }
    }

    isDirection(command) {
        let check = false;

        if (command === 'stop') {
            check = this.direction === 0;
        } else if (command === 'start') {
            check = this.direction === 1;
        } else if (command === 'reverse') {
            check = this.direction === -1;
        }

        return check;
    }

    startRotateAnimation(collideBall, sourcePoint) {
        let front = collideBall.x - sourcePoint.x;
        let side = collideBall.y - sourcePoint.y;

        this.rotate.value = getDegree(front, side);
        this.rotate.collide = collideBall;

        this.updateRotationDifference();
    }

    updateRotationDifference() {
        let sourcePoint = getRotationPosition(ball.r * 2, this.rotate.value - 90, this.rotate.collide.x, this.rotate.collide.y);
        this.rotate.currentDifference = getRotation(sourcePoint, this.rotate.collide, this);

        let checkSourcePoint = getRotationPosition(ball.r * 2, this.rotate.value - this.rotate.speed / scale - 90, this.rotate.collide.x, this.rotate.collide.y);
        let checkRotateDifference = getRotation(checkSourcePoint, this.rotate.collide, this);
        this.rotate.direction =  checkRotateDifference < this.rotate.currentDifference ? -1 : 1;

        if (!this.rotate.currentDifference) {
            // render = false;
            checkSameBalls(this.id, balls[this.id].indexOf(this));
        }
    }

    createParticles() {
        particles[this.id].push(new Particle(this.x, this.y, this.type));
    }

    draw(ctx, scale = 1) {
        if (this.percent >= 0) {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = this.type;

            if (this.rotate.currentDifference > 0) {
                this.updateRotationDifference();

                let rotateSpeed = this.rotate.currentDifference - this.rotate.speed <= 0 ? this.rotate.currentDifference : this.rotate.speed;
                this.rotate.value += this.rotate.direction * rotateSpeed;
                this.rotate.currentDifference -= rotateSpeed;
                // console.log(rotateSpeed);
                // console.log(this.rotate.source.percent, this.rotate.source);

                ctx.translate(this.rotate.collide.x, this.rotate.collide.y);
                ctx.rotate((this.rotate.value - 90 * 1.5) * Math.PI / 180);
                ctx.arc(ball.r * 1.4, ball.r * 1.4, ball.r * scale, 0, 2 * Math.PI);

                // console.log('a');

                if (!this.rotate.currentDifference) {
                    checkSameBalls(this.id, balls[this.id].indexOf(this));
                }
            } else {
                if (this.rotate.source) {
                    this.rotate.value = 0;
                    this.rotate.currentDifference = 0;
                    this.rotate.direction = 0;
                    this.rotate.source = null;
                }

                ctx.arc(this.x, this.y, ball.r * scale, 0, 2 * Math.PI);
            }

            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }
    }
}

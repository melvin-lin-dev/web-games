class Ball {
    constructor(color = '') {
        this.x = 0;
        this.y = 0;
        this.type = color ? color : randomBall();

        this.percent = 0;
        this.direction = 1;

        this.rotate = 0;
    }

    update() {
        let point = path.getPointAtLength(this.percent * pathLength);
        this.x = point.x;
        this.y = point.y;

        let speed = ball.speed;

        if(startingPhase){
            speed = ball.startSpeed;
        }else if(this.direction === -1){
            speed = ball.reverseSpeed;
        }

        this.percent += this.direction * speed / scale;
    }

    shootUpdate() {
        this.x += ball.shootSpeed * degreeToRadian('cos', this.rotate);
        this.y += ball.shootSpeed * degreeToRadian('sin', this.rotate);
    }

    directionMode(command){
        if(command === 'stop'){
            this.direction = 0;
        }else if(command === 'normal'){
            this.direction = 1;
        }else if(command === 'reverse'){
            this.direction = -1;
        }
    }

    isDirection(command){
        let check = false;

        if(command === 'stop'){
            check = this.direction === 0;
        }else if(command === 'start'){
            check = this.direction === 1;
        }else if(command === 'reverse'){
            check = this.direction === -1;
        }

        return check;
    }

    draw(scale = 1){
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = this.type;
        ctx.arc(this.x, this.y, ball.r * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    }
}

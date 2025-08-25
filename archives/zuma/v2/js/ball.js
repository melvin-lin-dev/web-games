class Ball {
    constructor(newBall) {
        this.el = newBall;
        this.type = newBall.getAttribute('fill');

        this.percent = 0;
        this.direction = 1;

        // console.log(this.el);
    }

    update() {
        let point = path.getPointAtLength(this.percent * path.getTotalLength());
        this.el.setAttribute("transform", "translate(" + (point.x - ball.r / 2) + "," + (point.y - ball.r / 2) + ")");

        this.percent += this.direction * ball.speed / scale;

        // if (parseInt(this.percent, 10) === 1) {
        //     this.direction = -1;
        // } else if (parseInt(this.percent, 10) < 0) {
        //     this.direction = 1;
        // }
    }
}

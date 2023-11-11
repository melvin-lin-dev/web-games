class Ball{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;

        this.speed = {
            default: 4,
            value: 0
        };
        this.speed.value = this.default;
    }

    update(){
        this.x = planet.radius * Math.cos(this.r);
        this.y = planet.radius * Math.sin(this.r);

        this.r += this.speed.value;
    }

    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

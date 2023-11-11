class Player{
    constructor(x, y, rotate){
        this.x = x;
        this.y = y;
        this.rotate = rotate;
    }

    draw(){
        ctx.save();
        ctx.rotate = this.rotate * Math.PI / 180;
        ctx.fillStyle = 'rgb(0,200,220)';
        ctx.fillRect(this.x, this.y, 100, 200);
        // ctx.drawImage()
        ctx.restore();
    }

    hit(){

    }
}

class Tile {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.r = tileSize / 7;
        this.type = type;
        this.color = color;

        this.dot = false;
        this.eatable = false;

        this.check = new Set();
        this.forbidKingMove = false;

        this.changePosition;

        this.needProtection = '';
        this.friendProtection = false;
    }

    draw() {
        ctx.save();
        let color = '';
        if (this.check.size) {
            color = 'rgb(245,30,30)';
        } else if (this.eatable) {
            color = 'rgb(230,100,0)';
        } else {
            color = this.color;
        }

        // if(this.needProtection){
        //     color = 'purple';
        // }

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, tileSize, tileSize);
        ctx.restore();

        if (this.dot) {
            let dotX = this.x + tileSize / 2;
            let dotY = this.y + tileSize / 2;

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0,130,230)';
            ctx.arc(dotX, dotY, this.r, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.closePath();
            ctx.restore();
        }
    }
}

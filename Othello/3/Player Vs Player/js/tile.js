class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = '';
        this.r = 25;
    }

    draw() {
        if (this.color) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            let arc = {
                x: this.x + size / 2,
                y: this.y + size / 2
            };
            ctx.arc(arc.x, arc.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }
}
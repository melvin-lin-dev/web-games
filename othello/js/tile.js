class Tile {
    constructor(x, y) { // On Load
        this.x = x;
        this.y = y;
        this.color = '';
        this.r = 20;

        this.validMove = false;

        this.clicked = false;
    }

    draw() { // Draw the tile / circle
        if (this.clicked) this.r++;
        if (this.r === 20) this.clicked = false;

        ctx.save();
        ctx.beginPath();
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.arc(this.x + size / 2, this.y + size / 2, this.r, 0, 2 * Math.PI);
            ctx.fill();
        } else if (this.validMove) {
            ctx.strokeStyle = turn;
            ctx.arc(this.x + size / 2, this.y + size / 2, this.r, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
}
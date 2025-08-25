let tileColor = {
    2: 'rgb(240,230,220)',
    4: 'rgb(220,210,200)',
    8: 'rgb(240,180,120)',
    16: 'rgb(240,150,100)',
    32: 'rgb(250,120,100)',
    64: 'rgb(250,90,60)',
    128: 'rgb(240,210,110)',
    256: 'rgb(240,200,100)',
    512: 'rgb(240,200,80)',
}

class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = '';
    }

    draw() {
        ctx.beginPath();
        ctx.save();

        let x = this.x * size;
        let y = this.y * size;

        ctx.fillStyle = this.value ? tileColor[this.value] : 'rgb(220,200,190)';
        ctx.fillRect(x, y, size, size);

        ctx.fillStyle = this.value == 2 || this.value == 4 ? 'rgb(130,120,100)' : 'white';
        ctx.font = '70px segoe ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.value, x + size / 2, y + size / 2);

        ctx.restore();
        ctx.closePath();
    }
}
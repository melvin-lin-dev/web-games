class Particle {
    constructor(x, y, type) {
        this.type = type;

        let range;

        switch (type) {
            case 'blood':
                this.r = random(12, 20);
                this.color = 'rgb(255,80,80)';
                range = 50;
                this.fadeSpeed = .003;
                break;
        }

        this.x = random(x - range, x + range);
        this.y = random(y - range, y + range);

        this.globalAlpha = 1;
    }

    update(){
        this.globalAlpha -= this.fadeSpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.globalAlpha = this.globalAlpha;
        ctx.fillStyle = this.color;
        switch (this.type) {
            case 'blood':
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                break;
        }
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }
}

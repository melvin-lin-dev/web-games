class Gem {
    constructor(x, y, w, h, gem, cmd = '') {
        this.x = x * w;
        this.y = y * h;
        this.w = h;
        this.h = h;

        this.rw = w;

        this.sx = gem * 80;
        this.sy = 0;
        this.sw = 80;
        this.sh = 80;

        this.rad = 30;

        this.score = 2;

        this.type = gem;

        this.tes = false;

        this.destroyed = false;

        if (cmd) this.toZero();
    }

    toZero() {
        let toZeroInterval = setInterval(() => {
            if (this.y < 0) {
                this.y += speedY;
            } else {
                this.y = 0;
                clearInterval(toZeroInterval);
            }
        })
    }

    draw() {
        let image = new Image();
        image.src = 'assets/img/gems.png';

        if (this.tes) {
            ctx.save();
            ctx.fillRect(this.x, this.y, this.rw, this.h);
            ctx.restore();
        }

        if ((this == gem1 || this == gem2) && !changing) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.rw, this.h);
            ctx.restore();

            ctx.save();
            let randMove = Math.random() * 10 * (Math.random() <= 0.5 ? -1 : 1);
            ctx.translate(randMove, randMove);
            ctx.drawImage(image, this.sx, this.sy, this.sw, this.sh, this.x + (this.rw / 2 - this.w / 2), this.y, this.w, this.h);
            ctx.restore();
        } else {
            ctx.drawImage(image, this.sx, this.sy, this.sw, this.sh, this.x + (this.rw / 2 - this.w / 2), this.y, this.w, this.h);
        }

        if (this.destroyed) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.arc(this.x + this.rw / 2, this.y + this.rw / 2 - 21, this.rad, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.font = 'bold 25px segoe ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillText(this.score, this.x + this.rw / 2, this.y + this.rw / 2 - 22);
            ctx.restore();
        }
    }
}
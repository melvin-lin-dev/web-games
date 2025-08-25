class Score {
    constructor(id, firstBall, lastBall, score) {
        let width = firstBall.x - lastBall.x;
        let height = firstBall.y - lastBall.y;

        let startX = firstBall.x < lastBall.x ? firstBall.x : lastBall.x;
        let startY = firstBall.y < lastBall.y ? firstBall.y : lastBall.y;

        this.x = startX + Math.abs(width) / 2;
        this.y = startY + Math.abs(height) + 10;

        this.score = score * 10;
        this.color = firstBall.type;

        scoreEl.innerHTML = +scoreEl.innerHTML + this.score * scoreMultiplier[id];

        this.opacity = 1;
        this.fadeSpeed = 0.015;

        this.speed = 3;
        this.speedWeight = 0.01;

        this.scoreMultiplier = scoreMultiplier[id];
    }

    update() {
        this.y -= this.speed;
        this.speed -= this.speedWeight;

        this.opacity -= this.fadeSpeed;
    }

    draw(ctx) {
        ctx.save();

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '25px segoe ui';

        // SCORE
        let score = `+${this.score}`;
        ctx.fillText(score, this.x, this.y);
        ctx.fill();

        ctx.strokeText(score, this.x, this.y);
        ctx.lineWidth = 1;
        ctx.stroke();

        // COMBO
        if (this.scoreMultiplier > 1) {
            let combo = `COMBO X${this.scoreMultiplier}`;
            let comboY = this.y + 20;
            ctx.fillText(combo, this.x, comboY);
            ctx.fill();

            ctx.strokeText(combo, this.x, comboY);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    }
}

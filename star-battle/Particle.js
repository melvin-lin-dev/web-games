class Particle {
    constructor(x, y, type = 0, score) {
        let total = 8;

        this.particleTypes = ['particles', 'coinParticles'];

        this.particles = [];
        this.coinParticles = [];

        this.r = 4;

        this.opacity = 1;

        this.score = {
            x: x,
            y: y,
            score: (score > 0 ? '+' : '') + score,
        };

        if (type > 10) type = 10;

        this.particleTypes.forEach(particleType => {
            for (let i = 0; i < (particleType === 'particles' ? total : type); i++) {
                this[particleType].push({
                    x: x - this.r / 2,
                    y: y - this.r / 2,
                    speed: Math.floor(Math.random() * 6) + 1,
                    angle: Math.floor(Math.random() * 360)
                });
            }
        });
    }

    render() {
        this.particleTypes.forEach(particleType => {
            for (let i = 0; i < this[particleType].length; i++) {
                let particle = this[particleType][i];
                let radians = particle.angle * Math.PI / 180;

                let mx = Math.sin(radians) * particle.speed;
                let my = Math.cos(radians) * particle.speed;

                if (particleType === 'particles') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.globalAlpha = this.opacity;
                    ctx.arc(particle.x, particle.y, this.r, 0, 2 * Math.PI);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                } else {
                    let img = imageAssets['coin.png'];
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.drawImage(img, particle.x, particle.y, this.r ** 2, this.r ** 2);
                    ctx.restore();
                }

                particle.x += mx;
                particle.y += my;
            }
        });

        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.score.score > 0 ? "#0f0" : "#f00";
        ctx.font = "16px Permanent Marker";
        ctx.fontWeight = 900;
        ctx.fillText(this.score.score, this.score.x, this.score.y);
        ctx.closePath();
        ctx.restore();

        this.score.y -= 2;

        this.opacity -= .02;
    }
}
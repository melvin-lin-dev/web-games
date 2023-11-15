class Particle {
    constructor(x, y, color, rotationMultiplier = 1, scaleMultiplier = 1) {
        this.color = color;

        this.particles = [];

        for (let i = 0; i <= 30; i++) {
            let rotation = random(ball.r * 2 * rotationMultiplier, 360) * rotationMultiplier;

            this.particles.push({
                x, y,
                radius: 3.5,
                rotation,
                speed: random(5, 20) / scale * rotation,
                scale: {
                    value: scaleMultiplier,
                    speed: 0.02
                }
            })
        }
    }

    draw() {
        this.particles.forEach((particle, index) => {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8;
            ctx.arc(particle.x, particle.y, particle.radius * particle.scale.value, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();
            ctx.restore();

            particle.scale.value -= particle.scale.speed;

            let currentPoint = getRotationPosition(particle.speed, particle.rotation);
            particle.x -= currentPoint.x;
            particle.y -= currentPoint.y;

            if (particle.scale.value <= 0) {
                this.particles.splice(index, 1);
            }
        })
    }
}

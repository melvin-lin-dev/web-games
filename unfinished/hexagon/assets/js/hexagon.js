class Hexagon {
    constructor(x, y, value = 0) {
        this.x = x;
        this.y = y;

        this.value = value;

        this.hexagonGradient = ctx.createLinearGradient(this.x - hexagonSize.x, this.y + hexagonSize.y, this.x, this.y - hexagonSize.y);
        this.hexagonGradient.addColorStop(0, 'rgb(255,225,84)');
        this.hexagonGradient.addColorStop(.5, 'rgb(171,235,97)');
        this.hexagonGradient.addColorStop(1, 'rgb(114,214,255)');

        this.dot = {
            list: [],
            r: 0,
        };

        this.star = {
            r: 5,
            inset: 2,
            n: 5
        };

        this.collide = false;

        this.generateDots();
    }

    generateDots() {
        this.dot.list = [];
        this.dot.r = this.value === 1 ? 6 : 4;

        for (let i = 0; i < this.value; i++) {
            switch (this.value) {
                case 1:
                    this.dot.list.push({
                        x: 0,
                        y: 0
                    });
                    break;
                case 2:
                    this.dot.list.push({
                        x: 0,
                        y: -this.dot.r * 2 + i * this.dot.r * 4
                    });
                    break;
                case 3:
                    this.dot.list.push({
                        x: 0,
                        y: -this.dot.r * 3 + i * this.dot.r * 3
                    });
                    break;
                case 4:
                case 5:
                    this.dot.list.push({
                        x: this.dot.r * 2 * ((i + 1) % 2 === 0 ? 1 : -1),
                        y: this.dot.r * 2 * (i < 2 ? -1 : 1)
                    });
                    break;
                case 6:
                    this.dot.list.push({
                        x: this.dot.r * 2 * ((i + 1) % 2 === 0 ? 1 : -1),
                        y: -this.dot.r * 3 + (i % 2 === 1 ? i - 1 : i) * this.dot.r * 1.5
                    });
                    break;
            }

            if (this.value === 5) {
                this.dot.list[this.value - 1] = {
                    x: 0,
                    y: 0
                };
            }
        }
    }

    updateShape() {
        this.hexPath = new Path2D();
        // TEMP: CHANGE this.x + this.y to 0
        this.hexPath.moveTo(this.x + hexagonSize.x * Math.cos(Math.PI / 6), this.y + hexagonSize.y * Math.sin(Math.PI / 6));

        for (let side = 0; side < 7; side++) {
            let rad = (side * 2 + 1) * Math.PI / 6;
            let size = hexagonSize.x;
            if (side === -1 || side === 1 || side === -1 || side === 4) size = hexagonSize.y;
            this.hexPath.lineTo(this.x + size * Math.cos(rad), this.y + size * Math.sin(rad));
        }
    }

    draw() {
        this.updateShape();
        // ctx.save();
        // ctx.beginPath();
        // ctx.arc(this.x + hexagonSize * Math.cos(Math.PI / 6), this.y + hexagonSize * Math.sin(Math.PI / 6),5,0,2*Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.restore();

        ctx.save();

        if (this.value === 7) {
            ctx.fillStyle = this.hexagonGradient;
        } else {
            ctx.fillStyle = this.value ? hexagonColor[this.value] : "rgba(255,255,255,.2)";
        }

        if (this.collide) {
            ctx.fillStyle = this.collide ? 'black' : 'rgba(255,255,255,.5)';
        }
        ctx.fill(this.hexPath);

        ctx.strokeStyle = this.value ? 'white' : 'rgba(255,255,255,.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke(this.hexPath);

        ctx.restore();

        if (this.value === 7) {
            ctx.save();

            ctx.translate(this.x, this.y);
            ctx.rotate(35 * Math.PI / 180);

            ctx.beginPath();

            ctx.moveTo(0, -this.star.r);
            for (var i = 0; i < this.star.n; i++) {
                ctx.rotate(Math.PI / this.star.n);
                ctx.lineTo(0, -this.star.r * this.star.inset);
                ctx.rotate(Math.PI / this.star.n);
                ctx.lineTo(0, -this.star.r);
            }

            ctx.closePath();

            ctx.fillStyle = 'rgb(188,23,250)';
            ctx.fill();

            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(this.x, this.y);

            this.dot.list.forEach(dot => {
                ctx.beginPath();

                ctx.arc(dot.x, dot.y, this.dot.r, 0, 2 * Math.PI);

                ctx.fillStyle = 'white';
                ctx.fill();

                ctx.closePath();
            });

            ctx.restore();
        }
    }
}

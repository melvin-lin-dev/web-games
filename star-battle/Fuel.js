class Fuel {
    constructor() {
        this.img = imageAssets['fuel.png'];

        this.width = 45;
        this.height = 61;

        this.angle = 35;

        this.scale = 1;
        this.minScale = .9;
        this.maxScale = 1.1;
        this.rangeScale = .0075;
        this.isScaling = 0;

        this.generateLocation();
    }

    render() {
        if (this.status) {
            this.animate();

            //  Rendering Fuel
            let width = this.width * this.scale;
            let height = this.height * this.scale;
            ctx.save();
            ctx.translate(this.x + width / 2, this.y + height / 2);
            let radians = this.angle * Math.PI / 180;
            ctx.rotate(radians);
            ctx.drawImage(this.img, -width / 2, -height / 2, width, height);
            ctx.restore();

            if (this.x < -100 && this.y > canvas.height + 100 && !game.IS_CHANGING_LEVEL) {
                this.generateLocation();
            }
        }
    }

    animate() {
        //  Animating Fuel

        if (this.isScaling) {
            this.scale += this.rangeScale;
        } else {
            this.scale -= this.rangeScale;
        }

        if (this.scale <= this.minScale) {
            this.isScaling = 1;
        }

        if (this.scale >= this.maxScale) {
            this.isScaling = 0;
        }

        this.angle += 1.5;

        this.x -= 2.5;
        this.y += 2;
    }

    generateLocation() {
        this.status = 0;

        setTimeout(() => {
            this.x = Math.floor(Math.random() * (canvas.width / 2)) + canvas.width / 2;
            this.y = -Math.floor(Math.random() * 200);
            this.status = 1;
        }, 5500);
    }
}
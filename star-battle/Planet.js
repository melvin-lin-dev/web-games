class Planet {
    constructor(type) {
        this.type = type;

        this.img = new Image;

        //  Declaring Planet by Type

        switch (type) {
            case 1:
                this.img = imageAssets['planet_5.png'];
                this.width = 64;
                this.height = 64;
                this.speed = 1.1;
                break;
            case 2:
                this.img = imageAssets['planet_4.png'];
                this.width = 90;
                this.height = 90;
                this.speed = 1.7;
                break;
            case 3:
                this.img = imageAssets['planet_3.png'];
                this.width = 140;
                this.height = 140;
                this.speed = 2.4;
                break;
            case 4:
                this.img = imageAssets['planet_2.png'];
                this.width = 180;
                this.height = 180;
                this.speed = 3;
                break;
            case 5:
                this.img = imageAssets['planet_1.png'];
                this.width = 240;
                this.height = 240;
                this.speed = 4;
                break;
        }

        if (canvas.offsetHeight > 600) {
            this.width *= 5 / 3;
            this.height *= 5 / 3;
        }
        if (canvas.offsetWidth > 1000) {
            this.speed *= 5 / 3;
        }


        this.generateLocation();
    }

    render() {
        //  Rendering Planet

        if (this.x < canvas.offsetWidth && this.x + this.width > 0 &&
            this.y < canvas.offsetHeight && this.y + this.height > 0
        ) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }

        if (this.x < -500)
            this.generateLocation();

        this.x -= this.speed;
    }

    generateLocation() {
        // Generate Planet Location
        this.x = Math.floor(Math.random() * canvas.width) + canvas.width;
        this.y = Math.floor(Math.random() * (canvas.height - this.height));
    }
}
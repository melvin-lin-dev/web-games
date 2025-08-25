class Friend {
    constructor() {
        //  Declaring Friend

        this.img = imageAssets['ship_2.png'];

        this.width = 50;
        this.height = 50;

        this.speed = 4;

        if (canvas.offsetHeight > 600) {
            this.width *= 5 / 3;
            this.height *= 5 / 3;
        }
        if (canvas.offsetWidth > 1000) {
            this.speed *= 5 / 3;
        }

        this.generateLocation();

        this.score = -10;
        this.maxLife = 10;
        this.coins = 0;

        this.sound = new Audio();
        this.sound.src = audioAssets['destroyed.mp3'].src;
    }

    render() {
        //  Rendering Friend

        if (game.stats.countTime % 5 === 0) {
            this.frame++;

            if (this.frame >= 3)
                this.frame = 0;
        }

        ctx.drawImage(this.img, 80.25 * this.frame, 0, 80.25, 81, this.x, this.y, this.width, this.height);

        ctx.beginPath();
        ctx.rect(this.x, this.y - 10, this.width * this.life / this.maxLife, 5);
        ctx.fillStyle = "#0f0";
        ctx.fill();
        ctx.closePath();


        if (this.x < -500 && !game.IS_CHANGING_LEVEL)
            this.generateLocation();

        this.x -= this.speed;
    }

    generateLocation() {
        // Generate Friend Location
        this.x = Math.floor(Math.random() * canvas.width) + canvas.width;
        this.y = Math.floor(Math.random() * (canvas.height - this.height));

        this.frame = 0;

        this.life = this.maxLife;
    }
}
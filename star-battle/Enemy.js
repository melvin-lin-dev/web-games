class Enemy {
    constructor(type, level) {
        this.img = new Image();

        this.type = type;
        this.level = level;

        switch (type) {
            case 1:
                this.img = imageAssets['ship_3.png'];
                this.width = 50;
                this.height = 50;
                this.speed = 3.2;
                this.score = 5;
                this.coins = 2;
                switch (this.level) {
                    case 1:
                        this.maxLife = 10;
                        break;
                    case 2:
                        this.maxLife = 20;
                        break;
                    case 3:
                        this.maxLife = 30;
                        break;
                    case 4:
                        this.maxLife = 40;
                        break;
                    default:
                        this.maxLife = 50;
                        break;
                }
                break;
            case 3:
                this.img = imageAssets['ship_2.png'];
                this.width = 50;
                this.height = 50;
                this.speed = 4;
                this.score = -5;
                this.coins = 0;
                this.maxLife = 10;
                break;
            case 2:
                this.img = imageAssets['asteroid.png'];
                this.width = 60;
                this.height = 60;
                this.speed = 3.6;
                this.score = 10;
                this.coins = 4;
                switch (this.level) {
                    case 1:
                        this.maxLife = 20;
                        break;
                    case 2:
                        this.maxLife = 30;
                        break;
                    case 3:
                        this.maxLife = 40;
                        break;
                    case 4:
                        this.maxLife = 60;
                        break;
                    default:
                        this.maxLife = 100;
                        break;
                }
                break;
        }

        if (canvas.offsetHeight > 600) {
            this.width *= 5 / 3;
            this.height *= 5 / 3;
        }
        if (canvas.offsetWidth > 1000) {
            this.speed *= 5 / 3;
        }

        this.sound = new Audio();
        this.sound.src = './sound/destroyed.mp3';

        this.generateLocation();

        this.bullets = [];
    }

    render() {
        if (this.x < canvas.offsetWidth && this.x + this.width > 0 &&
            this.y < canvas.offsetHeight && this.y + this.height > 0
        ) {
            if (this.type === 1 || this.type === 3) {
                if (game.stats.countTime % 5 === 0) {
                    this.frame++;

                    if (this.frame >= 3)
                        this.frame = 0;
                }

                if (this.type === 1 && this.x + this.width < canvas.width - 100 && this.IS_SHOOT) {
                    this.bullets.push(new Bullet(this.x + 20, this.y + this.height / 2, 1));
                    this.IS_SHOOT = 0;
                }

                ctx.drawImage(this.img, 80 * this.frame, 0, 80, 80, this.x, this.y, this.width, this.height);
            } else if (this.type === 2) {
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.angle * Math.PI / 180);

                this.frame = this.life / this.maxLife > .5 ? 0 : 1;

                ctx.drawImage(this.img, this.frame * 512, 0, 512, 512, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();

                this.angle += 2;
            }

            ctx.beginPath();
            ctx.rect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = "#ccc";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(this.x, this.y - 10, this.width * this.life / this.maxLife, 5);
            ctx.fillStyle = this.type === 3 ? "#0f0" :  "#f00";
            ctx.fill();
            ctx.closePath();
        }

        if (this.x < -500 && !game.IS_CHANGING_LEVEL)
            this.generateLocation();

        this.x -= this.speed;
    }

    generateLocation() {
        // Generate Enemy Location
        if (game.IS_CHANGING_LEVEL) {
            this.x = -this.width - 50;
        } else {
            this.x = Math.floor(Math.random() * (canvas.width * 2)) + canvas.width;
            this.y = Math.floor(Math.random() * (canvas.height - this.height));

            this.frame = 0;

            if (this.type === 1) {
                this.IS_SHOOT = 1;
            } else if (this.type === 2) {
                this.angle = 0;
            }

            this.life = this.maxLife;
        }
    }
}
class Bullet {
    constructor(x, y, IS_LEFT = 0, bullet_level = 0, bulletType = 1) {
        //  Declaring Bullet

        this.IS_LEFT = IS_LEFT;

        let audioType = '';

        this.bulletType = bulletType;

        this.speed = game.equipment.stats.bullet[bulletType].speed;
        this.power = game.equipment.stats.bullet[bulletType].power;

        switch (bulletType) {
            case 1:
                this.width = 30;
                this.height = 6;
                this.img = imageAssets['bullet.png'];


                audioType = 'shoot.mp3';

                switch (bullet_level) {
                    case 2:
                        this.power = 30;
                        break;
                    default:
                        this.power = 10;
                        break;
                }
                break;
            case 2:
                this.width = 50;
                this.height = 20;
                this.img = imageAssets['rocket.png'];


                audioType = 'rocket.mp3';

                switch (bullet_level) {
                    case 2:
                        this.power = 50;
                        break;
                    default:
                        this.power = 20;
                        break;
                }

                this.exhaust = {
                    width: this.width / 3,
                    height: this.height / 2,
                    scale: 1,
                    maxScale: 1.35,
                    minScale: .75,
                    isScaling: 1,
                    rangeScale: .04,
                    image: imageAssets['rocket-exhaust.png']
                };
                break;
        }

        if (canvas.offsetHeight > 600) {
            this.width *= 5 / 3;
            this.height *= 5 / 3;
        }

        if (canvas.offsetWidth > 1000) {
            this.speed *= 5 / 3;
        }

        this.x = x;
        this.y = y - this.height / 2;

        this.sound = new Audio();
        this.sound.src = './sound/' + audioType;
        this.sound.volume = game.volume;
        this.sound.autoplay = true;
        this.sound.play();
    }

    render() {
        if(this.exhaust) {
            // Rendering Exhaust

            if(this.exhaust.isScaling){
                this.exhaust.scale += this.exhaust.rangeScale;

                if(this.exhaust.scale >= this.exhaust.maxScale){
                    this.exhaust.isScaling = 0;
                    this.exhaust.scale = this.exhaust.maxScale;
                }
            }else{
                this.exhaust.scale -= this.exhaust.rangeScale;

                if(this.exhaust.scale <= this.exhaust.minScale){
                    this.exhaust.isScaling = 1;
                    this.exhaust.scale = this.exhaust.minScale;
                }
            }

            let exhaustX = this.x - this.exhaust.width * this.exhaust.scale + 8;
            let exhaustY = this.y + this.height / 2 - this.exhaust.height * this.exhaust.scale / 2;
            let exhaustWidth = this.exhaust.width * this.exhaust.scale;
            let exhaustHeight = this.exhaust.height * this.exhaust.scale;
            ctx.drawImage(this.exhaust.image, exhaustX, exhaustY, exhaustWidth, exhaustHeight);
        }

        //  Rendering Bullet
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

        if (this.IS_LEFT) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }

    }
}
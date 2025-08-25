class Boss {
    constructor() {
        this.img = new Image();

        this.width = canvas.offsetHeight - 100;
        this.height = canvas.offsetHeight - 100;

        this.boss = true;

        this.sound = new Audio();
        this.sound.src = './sound/destroyed.mp3';

        this.x = canvas.offsetWidth;
        this.y = 50;

        this.minY = this.y - 10;
        this.maxY = this.y + 10;

        this.speed = 1;
        this.move_up = false;

        this.bullets = [];

        this.frame = 1;

        this.coming = true;

        this.maxLife = 1000;
        // this.maxLife = 10;
        this.life = this.maxLife;
        this.score = 100;
        this.coins = 100;

        $('#bossHealth').removeClass('hide');

        this.lasers = [];
        this.is_laser_out = false;
        this.laser_go_out = false;

        this.bombs = [];
    }

    render() {
        if (game.stats.countTime % 6 === 0) {
            this.frame++;
            if (this.frame === 5) this.frame = 1;
        }

        this.img = imageAssets[`enemy${this.frame}.svg`];

        if (game.stats.countTime % (60 * 10) === 0 && !this.lose) {
            // if (this.life / this.maxLife > .5) {
                if (!this.lasers.length) {
                    this.is_laser_out = false;
                    this.laser_go_out = false;
                    this.lasers.push({
                        x: canvas.offsetWidth,
                        y: game.player.y - 15,
                        height: game.player.height + 30,
                        width: canvas.offsetWidth + 100,
                        opacity: .5,
                        is_background: true,
                    });
                }
            // }
        }

        this.collision = {
            x: this.x + this.width / 2,
            y: this.y + 25,
            width: this.width - 50,
            height: this.height - 50,
        };

        if (this.lasers.length) this.drawLaser();

        ctx.save();
        if (this.lose) {
            if (game.stats.countTime % 5 === 0) {
                ctx.globalAlpha = .5;
            }
            this.destroy();
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();

        this.movement();

        $('#bossHp').css({
            width: ((this.life / this.maxLife) * 100) + '%'
        });

        if (this.coming) {
            this.x -= 4;

            game.IS_CHANGING_LEVEL = true;

            if (this.x < canvas.offsetWidth - this.width * 2 / 3) {
                game.IS_CHANGING_LEVEL = false;
                this.coming = false;
            }
        }
    }

    drawLaser() {
        let all_out = true;

        if (this.lasers.length) {
            for (let i = 0; i < this.lasers.length; i++) {
                let laser = this.lasers[i];

                if (this.laser_go_out) {
                    laser.x -= 100;

                    if (laser.x + laser.width < 0) {
                        all_out = true;
                    } else {
                        all_out = false;
                    }
                } else if (laser.x < 0) {
                    laser.x = 0;
                }

                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "#75f0f0";
                ctx.globalAlpha = laser.opacity;
                ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
                ctx.closePath();
                ctx.restore();

                if (!laser.is_background && game.checkCollision(game.player, laser) && game.player.touchable) {
                    game.planeCollided();
                }

                if (laser.x > 0) {
                    laser.x -= 50;
                } else if (this.is_laser_out === false) {
                    this.is_laser_out = true;
                    setTimeout(() => {
                        this.lasers.push({
                            x: canvas.offsetWidth,
                            y: laser.y,
                            height: laser.height,
                            width: canvas.offsetWidth,
                            opacity: 1,
                        });
                    }, 500);
                } else if (this.lasers.length === 2 && this.lasers[1].x <= 0) {
                    setTimeout(() => {
                        this.laser_go_out = true;
                    }, 2000);
                }
            }
        }

        if (this.laser_go_out && all_out) {
            this.lasers = [];
        }
    }

    movement() {
        if (!this.lose) {
            if (this.move_up) {
                this.y -= this.speed;
            } else {
                this.y += this.speed;
            }

            if (this.y < this.minY) this.move_up = false;
            if (this.y > this.maxY) this.move_up = true;
        }
    }

    destroy() {
        this.lose = 1;
        this.randomMovement();
        this.x += 2;

        if (this.x > canvas.offsetWidth) {
            $('#bossHealth').addClass('hide');
            game.enemyGenerator(true);
        }
    }

    randomMovement() {
        let angle = Math.floor(Math.random() * 360);
        let radians = angle * Math.PI / 180;

        let mx = Math.sin(radians) * 8;
        let my = Math.cos(radians) * 8;

        this.x += mx;
        this.y += my;
    }
}
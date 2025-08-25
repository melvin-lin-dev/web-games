class Player {
    constructor() {
        //  Declaring Plane Items
        this.img = imageAssets['plane.png'];

        this.width = 65;
        this.height = 50;

        this.x = 100;
        this.y = (canvas.height - this.height) / 2;

        this.speedX = 0;
        this.speedY = 0;
        // Declare Entering Zone
        this.defaultScale = 1;
        this.scale = this.defaultScale;
        this.rangeScale = .01;
        this.entering = false;
        this.shopMode = '';

        this.sound = new Audio();
        this.sound.src = './sound/destroyed.mp3';

        //  Declaring Plane's Exhaust

        this.exhaust = {
            width: 47,
            height: 20,
            scale: 1,
            minScale: .8,
            maxScale: 1.1,
            rangeScale: .0075,
            isScaling: 0,
            angle: 0,
            maxAngle: 15,
            minAngle: -15,
            rangeAngle: 3
        };

        if (canvas.offsetHeight > 600) {
            this.width *= 5 / 3;
            this.height *= 5 / 3;
            this.exhaust.width *= 5 / 3;
            this.exhaust.height *= 5 / 3;
        }

        if (canvas.width > 1000) {
            this.speed *= 5 / 3;
        }

        //  Declaring Bullet

        this.bullets = [];

        this.shoot_delay = 500;
        this.bullet_level = 1;

        // Declaring Equipment

        this.equipment = {
            bullet: 1,
            exhaust: 1,
        };

        // Entering Position
        setTimeout(() => {
            let enterZoneRect = document.querySelector('.enter-zone').getBoundingClientRect();
            this.enterX = enterZoneRect.left - enterZoneRect.width / 2 - this.width / 2;
            this.enterY = enterZoneRect.top - enterZoneRect.height / 2 - this.height / 2;
        });

        this.shooting = false;
        this.do_shoot = null;
        this.shoot_timer = null;
        this.last_shoot = null;

        // Upgrade

        this.stats = {
            fuel: 30,
            bullet: 1
        };

        this.upgrade = {
            fuel: {
                maxUpgrade: 10,
                upgradeLevel: 0,
                value: 20
            },
            bullet: {
                maxUpgrade: 5,
                upgradeLevel: 0,
                value: 1
            }
        };

        // Fire Effects
        this.fireEffects = [];

        //    Invisible
        this.invisible_cooldown = 0;
        this.invisible_max_cooldown = 360;
        this.touchable = 1;
        this.invisible_duration = 240;
    }

    render() {
        //  Animate
        this.animate();
        //  Movement
        this.movement();

        //  Rendering Exhaust

        let exhaust = this.exhaust;

        let exhaustType = '';
        switch(this.equipment.exhaust){
            case 1:
                exhaustType = 'exhaust_1.png';
                break;
            case 2:
                exhaustType = 'exhaust_2.png';
                break;
        }
        let exhaustImage = imageAssets[exhaustType];
        let exhaustWidth = exhaust.width * exhaust.scale * this.scale;
        let exhaustHeight = exhaust.height * exhaust.scale * this.scale;
        let exhaustX = this.x - exhaustWidth / 2 * this.scale + exhaust.width - exhaustWidth;
        let exhaustY = this.y + (this.height - exhaustHeight) / 2;

        ctx.save();
        ctx.translate(exhaustX + exhaustWidth, exhaustY + exhaustHeight / 2);
        ctx.rotate(exhaust.angle * Math.PI / 180);
        if (this.invisible_cooldown === -1) ctx.globalAlpha = .3;
        ctx.drawImage(exhaustImage, -exhaustWidth, -exhaustHeight / 2, exhaustWidth, exhaustHeight);
        ctx.restore();

        //  Rendering Plane

        let playerWidth = this.width * this.scale;
        let playerHeight = this.height * this.scale;
        let playerX = this.x - 22 * (this.defaultScale - this.scale) + this.width - playerWidth;
        let playerY = this.y + (this.height - playerHeight) / 2;

        ctx.save();
        if (this.invisible_cooldown === -1) ctx.globalAlpha = .7;
        ctx.drawImage(this.img, playerX, playerY, playerWidth, playerHeight);
        ctx.restore();

        if ((this.shopMode === 'entering' && this.scale > 0) || (this.shopMode === 'leaving' && this.scale < this.defaultScale)) {
            this[this.shopMode + 'Shop']();
        }

        if (!this.shooting && this.do_shoot) {
            clearInterval(this.do_shoot);
            clearTimeout(this.shoot_timer)
        }

        if (this.invisible_cooldown > 0) {
            this.invisible_cooldown--;
        } else if (this.invisible_timeout) {
            this.touchable = 0;
            this.invisible_timeout--;
        }

        if (this.invisible_timeout === 1) this.deactiveInvisible(this.invisible_max_cooldown);

        $('.invisible-cooldown-percentage').css({
            strokeDashoffset: `calc(314.1592% * (${((this.invisible_max_cooldown - this.invisible_cooldown) / this.invisible_max_cooldown) * 100} / 100))`
        })
    }

    renderFireEffects() {
        if (game.stats.countTime % 30 === 0) {
            let size = 30;
            let scale = .1;
            this.fireEffects.push({
                x: this.x + (this.x * (this.defaultScale - this.scale)) - this.exhaust.width * this.exhaust.scale / 2,
                y: this.y + this.height / 2,
                s: size * this.scale,
                opacity: .8,
                scale,
                image: imageAssets[`fire-effect_${this.equipment.exhaust}.png`]
            });
        }

        for (let i = 0; i < this.fireEffects.length; i++) {
            let fireEffect = this.fireEffects[i];
            ctx.save();
            ctx.globalAlpha = fireEffect.opacity;
            ctx.drawImage(fireEffect.image, fireEffect.x + fireEffect.s * (1 - fireEffect.scale) / 2, fireEffect.y - fireEffect.s * fireEffect.scale / 2, fireEffect.s * fireEffect.scale, fireEffect.s * fireEffect.scale);
            ctx.restore();

            fireEffect.opacity -= .02;
            fireEffect.scale += .06;

            if (fireEffect.opacity < 0) {
                this.fireEffects.shift();
            }
        }
    }

    animate() {
        //  Plane Animation

        let exhaust = this.exhaust;

        if (this.speedX === 0) {
            if (exhaust.isScaling) {
                exhaust.scale += exhaust.rangeScale;
            } else {
                exhaust.scale -= exhaust.rangeScale;
            }
        } else {
            if (this.speedX > 0 && exhaust.scale <= exhaust.maxScale) {
                exhaust.scale += exhaust.rangeScale;
            } else if (this.speedX < 0 && exhaust.scale >= exhaust.minScale) {
                exhaust.scale -= exhaust.rangeScale;
            }
        }

        if (exhaust.scale <= exhaust.minScale) {
            exhaust.isScaling = 1;
        }

        if (exhaust.scale >= exhaust.maxScale) {
            exhaust.isScaling = 0;
        }
    }

    movement() {
        //  Plane Movement
        let exhaust = this.exhaust;

        if (this.shopMode) {
            this.x += this.scale * (this.shopMode === 'leaving' ? -1 : 1);
            return false;
        }

        this.x += this.speedX * game.equipment.stats.exhaust[game.player.equipment.exhaust].speed;
        this.y += this.speedY * game.equipment.stats.exhaust[game.player.equipment.exhaust].speed;

        if (this.speedY < -2) {
            if (exhaust.angle > exhaust.minAngle) {
                exhaust.angle -= exhaust.rangeAngle;
            }
        } else if (this.speedY > 2) {
            if (exhaust.angle < exhaust.maxAngle) {
                exhaust.angle += exhaust.rangeAngle;
            }
        } else {
            if (exhaust.angle > 0)
                exhaust.angle -= exhaust.rangeAngle;
            if (exhaust.angle < 0)
                exhaust.angle += exhaust.rangeAngle;
        }

        if (this.x < 0)
            this.x = 0;
        if (this.x + this.width > canvas.width)
            this.x = canvas.width - this.width;
        if (this.y < 0)
            this.y = 0;
        if (this.y + this.height > canvas.height)
            this.y = canvas.height - this.height
    }

    shoot() {
        this.triggerBullet();

        this.do_shoot = setInterval(() => {
            this.triggerBullet()
        }, this.shoot_delay)
    }

    triggerBullet() {
        if (!game.IS_CHANGING_LEVEL || !game.field_is_empty) {
            let ms = 0;

            if (this.last_shoot) {
                let next_shoot = new Date();

                ms = this.shoot_delay - ((next_shoot.getTime() - this.last_shoot.getTime()));

                ms = ms > this.shoot_delay ? this.shoot_delay : ms
            }

            this.shoot_timer = setTimeout(() => {
                if (game.pause === -1) {
                    this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 0, this.bullet_level, this.equipment.bullet));
                    this.last_shoot = new Date();
                }
            }, ms)
        }
    }

    setEnteringShop() {
        this.x = this.enterX;
        this.y = this.enterY;

        this.entering = true;
        this.shopMode = 'entering';

        ev.toggleEnterZone();
        this.touchable = 0;
    }

    enteringShop() {
        this.scale -= this.rangeScale;

        if (this.scale <= 0) {
            game.shopShip.shopping();
            $('#shop .content-menu > div').removeClass('active');
        }
    }

    leavingShop() {
        this.scale += this.rangeScale;

        if (this.scale >= this.defaultScale) {
            this.entering = false;
            this.shopMode = '';
            game.shopShip.leave();
        }
    }

    upgradeBulletDelay(delay) {
        this.shoot_delay = delay;
    }

    upgradeBulletLevel(level) {
        this.bullet_level = level;
    }

    invisible() {
        if (this.invisible_cooldown === 0) {
            this.invisible_cooldown = -1;

            $('.game-invisible').addClass('opacity-5');

            this.invisible_timeout = this.invisible_duration;
        }
    }

    deactiveInvisible(cooldown = 0) {
        this.invisible_timeout = null;
        $('.game-invisible').removeClass('opacity-5');
        this.touchable = 1;
        this.invisible_cooldown = cooldown;
    }
}
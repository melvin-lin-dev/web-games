class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 20;
        this.color = 'rgb(0,200,255)';

        this.speed = 5;

        this.hp = {
            value: 10,
            default: 10,
            backColor: 'rgb(200,200,200)',
            color: 'rgb(50,250,0)',
            width: 50,
            height: 7,
            heightMargin: 10,
        };

        this.weapon = {
            color: 'rgb(190,190,190)',
            width: 40,
            height: 5,
            rotate: 0
        };

        let bulletSpeed = 5;
        this.bullet = {
            damage: 2,
            bullets: [],
            w: 50,
            h: this.weapon.height,
            speed: {
                default: bulletSpeed,
                x: 1,
                y: -1
            },
            color: 'rgb(240,200,0)'
        }
    }

    updateBulletSpeed(front, side) {
        if (side >= 0 && front < 0) {
            this.bullet.speed.x = 1;
            this.bullet.speed.y = -1;
        } else if (side < 0 && front < 0) {
            this.bullet.speed.x = 1;
            this.bullet.speed.y = 1;
        } else if (side < 0 && front >= 0) {
            this.bullet.speed.x = -1;
            this.bullet.speed.y = 1;
        } else if (side >= 0 && front >= 0) {
            this.bullet.speed.x = -1;
            this.bullet.speed.y = -1;
        }
    }

    shoot() {
        let degreePerSpeed = 45 / this.bullet.speed.default;
        let bulletSpeedX = (this.weapon.rotate - Math.floor(this.weapon.rotate / 90) * 90) / degreePerSpeed * this.bullet.speed.x;
        let bulletSpeedY = (this.bullet.speed.default * 2 - Math.abs(bulletSpeedX)) * this.bullet.speed.y;

        let speed = {
            x: bulletSpeedX,
            y: bulletSpeedY
        };

        if ((this.bullet.speed.x > 0 && this.bullet.speed.y > 0) || (this.bullet.speed.x < 0 && this.bullet.speed.y < 0)) {
            speed.x = bulletSpeedY;
            speed.y = bulletSpeedX;
        }

        this.bullet.bullets.push(new Bullet(this.x, this.y, this.bullet.w, this.bullet.h, this.bullet.color, this.weapon.rotate));
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        this.drawHp();
        this.drawWeapon();
        this.drawBullets();
    }

    drawHp() {
        ctx.beginPath();

        let hpX = this.x - this.hp.width / 2;
        let hpY = this.y - this.r - this.hp.height - this.hp.heightMargin;

        ctx.save();
        ctx.fillStyle = this.hp.backColor;
        ctx.rect(hpX, hpY, this.hp.width, this.hp.height);
        ctx.fill();
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        ctx.restore();

        if (this.hp.value) {
            ctx.save();
            ctx.fillStyle = this.hp.color;
            ctx.fillRect(hpX, hpY, this.hp.width * this.hp.value / this.hp.default, this.hp.height);
            ctx.restore();
        }

        ctx.closePath();
    }

    drawWeapon() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.weapon.color;
        ctx.rotate((this.weapon.rotate - 90) * Math.PI / 180);
        ctx.fillRect(0, -this.weapon.height / 2, this.weapon.width, this.weapon.height);
        ctx.closePath();
        ctx.restore();
    }

    drawBullets() {
        this.bullet.bullets.forEach(bullet => {
            bullet.draw();
            bullet.update();
        })
    }

    move() {
        let newPlayer = {
            x: this.x,
            y: this.y,
            r: this.r
        };

        if (move.left) {
            newPlayer.x -= this.speed;

            if (newPlayer.x < this.r) {
                newPlayer.x = this.r;
            }
        }
        if (move.right) {
            newPlayer.x += this.speed;

            if (newPlayer.x > cvs.width - this.r) {
                newPlayer.x = cvs.width - this.r;
            }
        }
        if (move.up) {
            newPlayer.y -= this.speed;

            if (newPlayer.y < this.r) {
                newPlayer.y = this.r;
            }
        }
        if (move.down) {
            newPlayer.y += this.speed;

            if (newPlayer.y > cvs.height - this.r) {
                newPlayer.y = cvs.height - this.r;
            }
        }

        let collide = false;

        zombies.forEach(zombie => {
            if (isCollide(newPlayer, zombie)) {
                collide = true;
            }
        });

        if (!collide) {
            this.x = newPlayer.x;
            this.y = newPlayer.y;
        }
    }
}

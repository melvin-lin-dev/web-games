class Zombie {
    constructor(x, y, r, type = 'minion') {
        this.index = zombies.length;

        this.x = x;
        this.y = y;
        this.r = r;

        switch(type){
            case 'minion':
                this.color = 'red';

                this.speed = {
                    default: 3,
                    x: 1,
                    y: 1
                };

                this.hp = {
                    value: 10,
                    default: 10,
                    backColor: 'rgb(200,200,200)',
                    color: 'rgb(255,100,0)',
                    width: 50,
                    height: 7,
                    heightMargin: 10,
                };

                this.attack = {
                    time: 0,
                    limitTime: 50,
                    damage: .5
                };

                this.score = 5;
                break;
            case 'boss':
                this.color = 'rgb(180,0,0)';

                this.speed = {
                    default: 4
                };

                this.hp = {
                    value: 100,
                    default: 100,
                    backColor: 'rgb(200,200,200)',
                    color: 'rgb(200,50,0)',
                    width: 150,
                    height: 10,
                    heightMargin: 10,
                };

                this.attack = {
                    time: 0,
                    limitTime: 30,
                    damage: 3
                };

                this.score = 50;
                break;
        }
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

        ctx.save();
        ctx.fillStyle = this.hp.color;
        ctx.fillRect(hpX, hpY, this.hp.width * this.hp.value / this.hp.default, this.hp.height);
        ctx.restore();

        ctx.closePath();
    }

    updateSpeed(front, side) {
        if (side >= 0 && front < 0) {
            this.speed.x = 1;
            this.speed.y = -1;
        } else if (side < 0 && front < 0) {
            this.speed.x = 1;
            this.speed.y = 1;
        } else if (side < 0 && front >= 0) {
            this.speed.x = -1;
            this.speed.y = 1;
        } else if (side >= 0 && front >= 0) {
            this.speed.x = -1;
            this.speed.y = -1;
        }
    }

    move() {
        // let side = this.y - player.y;
        // let front = this.x - player.x;
        // let degree = convertToDegree(front, side);
        //
        // this.updateSpeed(front, side);
        //
        // let degreePerSpeed = 45 / this.speed.default;
        // let speedX = (degree - Math.floor(degree / 90) * 90) / degreePerSpeed * this.speed.x;
        // let speedY = (this.speed.default * 2 - Math.abs(speedX)) * this.speed.y;
        //
        // let speed = {
        //     x: speedX,
        //     y: speedY
        // };
        //
        // if ((this.speed.x > 0 && this.speed.y > 0) || (this.speed.x < 0 && this.speed.y < 0)) {
        //     speed.x = speedY;
        //     speed.y = speedX;
        // }
        //
        // let collide = false;
        //
        // let newZombie = {
        //     x: this.x + speed.x,
        //     y: this.y + speed.y,
        //     r: this.r
        // };
        //
        // zombies.forEach(zombie => {
        //     if (this.index !== zombie.index) {
        //         if (isCollide(newZombie, zombie)) {
        //             collide = true;
        //         }
        //     }
        // });
        //
        // if (isCollide(newZombie, player)) {
        //     this.attack.time++;
        //
        //     if (this.attack.time % this.attack.limitTime === 0) {
        //         player.hp.value -= this.attack.damage;
        //     }
        // } else {
        //     this.attack.time = 0;
        // }
        //
        // if (!collide && !isCollide(newZombie, player)) {
        //     this.x += speed.x;
        //     this.y += speed.y;
        // }





        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length) {
            dx /= length;
            dy /= length;
        }

        let collide = false;

        let newZombie = {
            x: this.x + dx * this.speed.default,
            y: this.y + dy * this.speed.default,
            r: this.r
        };

        zombies.forEach(zombie => {
            if (this.index !== zombie.index) {
                if (isCollide(newZombie, zombie)) {
                    collide = true;
                }
            }
        });

        if (isCollide(newZombie, player)) {
            this.attack.time++;

            if (this.attack.time % this.attack.limitTime === 0) {
                player.hp.value -= this.attack.damage;
                if(player.hp.value <= 0){
                    gameOver = true;
                }
            }
        } else {
            this.attack.time = 0;
        }

        if (!collide && !isCollide(newZombie, player)) {
            this.x += dx * this.speed.default;
            this.y += dy * this.speed.default;
        }
    }
}

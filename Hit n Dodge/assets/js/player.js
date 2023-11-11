class Player {
    constructor(name, index, rotation) {
        this.name = name;
        this.index = index;
        this.rotation = rotation;

        this.hp = 5;

        this.hitBoxSize = {
            width: playerProp.image.size.width + 80,
            height: playerProp.image.size.height
        };

        // this.zone = {
        //     hit: false,
        //     collide: false
        // };

        this.cooldown = {
            hit: {
                value: 0,
                default: 30
            },
            invincible: {
                value: 0,
                default: 100
            },
        };
        this.collideCheck = false;

        this.weapon = {
            x: 0,
            rotation: 0,
            return: 1,
            animate: false
        };

        this.duck = {
            value: 0,
            time: 0,
            return: 1,
            animate: false,
        };

        this.facing = null;

        this.fall = {
            rotate: {
                value: 0,
                direction: 0,
                speed: playerProp.fall.rotateSpeed
            },
            target: {
                x: 0,
                y: 0
            },
            scale: 1,
            animate: false,
            over: false
        };

        this.setPosition(playerProp.radius);
    }

    setIndication() {
        let indication = document.querySelector('.indication');
        let sides = [['top', 'left'], ['top', 'right'], ['bottom', 'right'], ['bottom', 'left']];
        let currentSide = sides[this.index];

        // let y = this.y - playerProp.image.size.height * playerProp.image.scale * 1.75;
        // let x = this.x - playerProp.image.size.width * playerProp.image.scale * 1.75;
        let y = playerProp.image.size.height * playerProp.image.scale * 1.75;
        let x = playerProp.image.size.width * playerProp.image.scale * 1.75;

        if (currentSide[0] === 'bottom') {
            y = cvs.height - this.y - y;
        } else { // Top
            y = this.y - y;
        }

        if (currentSide[1] === 'right') {
            x = cvs.width - this.x - x;
        } else { // Left
            x = this.x - x;
        }

        indication.style[currentSide[0]] = y + 'px';
        indication.style[currentSide[1]] = x + 'px';
        indication.style.transform = `rotate(${this.rotation}deg)`;
    }

    checkFacing() {
        let rotation = ball.rotation + this.rotation + 90;

        if (rotation < 0) {
            rotation = 360 + rotation % 360;
        }

        this.facing = rotation % 360 < 180 ? -1 : 1;

        if (this.index % 2) {
            this.facing *= -1;
        }
    }

    setPosition(radius) {
        let point = getRotatedPoint(radius, this.rotation - 90, cvs.width / 2, cvs.height / 2);
        this.x = point.x;
        this.y = point.y;
    }

    draw() {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(degToRad(this.rotation + this.fall.rotate.value));
        ctx.scale(this.fall.scale * this.facing, this.fall.scale);

        // ctx.save();
        // ctx.beginPath();
        //
        // ctx.fillStyle = this.zone.hit ? 'green' : 'blue';
        // ctx.fillRect(-this.hitBoxSize.width / 2, -this.hitBoxSize.height / 2, this.hitBoxSize.width, this.hitBoxSize.height);
        //
        // ctx.closePath();
        // ctx.restore();
        //
        // ctx.save();
        // ctx.beginPath();
        //
        // ctx.fillStyle = this.zone.collide ? 'red' : 'purple';
        // ctx.fillRect(-playerProp.image.size.width / 2, -playerProp.image.size.height / 2, playerProp.image.size.width, playerProp.image.size.height);
        //
        // ctx.closePath();
        // ctx.restore();

        // YOU
        // ctx.save();
        //
        // ctx.translate(0, -250);
        // ctx.fillStyle = 'rgb(220,200,50)';
        // ctx.strokeStyle = 'rgb(200,160,0)';
        //
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.x + 50, this.y - 50);
        // ctx.lineTo(this.x - 50, this.y - 50);
        // ctx.closePath();
        //
        // ctx.fill();
        // ctx.lineWidth = 5;
        // ctx.stroke();
        //
        // ctx.restore();

        ctx.drawImage(playerProp.image.img, -playerProp.image.size.width / 2, -playerProp.image.size.height / 2, playerProp.image.size.width, playerProp.image.size.height);

        ctx.save();
        ctx.translate(playerProp.weapon.image.size.width + 15, 0);
        ctx.rotate(degToRad(25 - this.weapon.rotation));
        ctx.drawImage(playerProp.weapon.image.img, -this.weapon.x, -playerProp.weapon.image.size.height + 40, playerProp.weapon.image.size.width, playerProp.weapon.image.size.height);
        ctx.restore();

        if (this.cooldown.invincible.value) {
            ctx.save();
            ctx.beginPath();

            this.collideCheck = this.cooldown.invincible.value > this.cooldown.invincible.default / 1.3;
            ctx.fillStyle = this.collideCheck ? playerProp
                .shield.collideGradient : playerProp.shield.gradient;
            ctx.scale(1, 1.15);
            ctx.arc(0, 5, playerProp.shield.r, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();
            ctx.restore();

            this.cooldown.invincible.value--;
        }

        ctx.restore();

        if (!this.fall.animate) {
            this.animateHit();
            this.animateDodge();
        } else {
            this.animateFall();
        }
    }

    collide() {
        if (!this.cooldown.invincible.value && this.hp) {
            this.hp--;

            let currentPlayerStatus = playerContainer.children[this.index];
            currentPlayerStatus.querySelector('.heart-container').children[this.hp].classList.add('heart-lost');

            if (!this.hp) {
                currentPlayerStatus.classList.add('lose');
                document.querySelector('.indication').classList.add('over');

                this.fall.animate = true;
                this.fall.rotate.direction = ball.direction;

                let targetX, targetY;

                let checkRotation = Math.abs(ball.direction * 45 + this.rotation);
                if (!(checkRotation % 180)) { // If vertical
                    targetX = cvs.width / 2;
                    targetY = (checkRotation % 360 ? 1 : -1) * fallMargin + cvs.height / 2;
                } else {
                    checkRotation %= 360;
                    targetX = (checkRotation === 90 ? 1 : -1) * fallMargin + cvs.width / 2;
                    targetY = cvs.height / 2;
                }

                this.fall.target.x = targetX;
                this.fall.target.y = targetY;
            } else {
                this.cooldown.invincible.value = this.cooldown.invincible.default;
            }
        }
    }

    hit() {
        if (!this.weapon.animate && !(checkHitZone(this) && this.cooldown.invincible.value) && !this.duck.animate) {
            socket.emit('player_hit');
            // this.weapon.animate = true;
            //
            // if (checkHitZone(this)) {
            //     ball.hit();
            // }
        }
    }

    dodge() {
        socket.emit('player_dodge');
        // this.duck.animate = true;
    }

    animateHit() {
        if (this.weapon.animate) {
            this.weapon.rotation += this.weapon.return * playerProp.weapon.hit.speed;
            this.weapon.x += this.weapon.return * playerProp.weapon.hit.moveSpeed;

            if (this.weapon.return === 1 && this.weapon.rotation >= playerProp.weapon.hit.range) {
                this.weapon.return = -1;
            } else if (this.weapon.return === -1 && this.weapon.rotation <= 0) {
                this.weapon.rotation = 0;
                this.weapon.return = 1;
                this.weapon.x = 0;
                this.weapon.animate = false;
            }
        }
    }

    animateDodge() {
        if (this.duck.animate) {
            if (this.duck.return) {
                this.duck.value += this.duck.return * playerProp.duck.speed;
            } else {
                this.duck.time++;

                if (this.duck.time >= playerProp.duck.time) {
                    this.duck.return = -1;
                }
            }

            this.setPosition(playerProp.radius - this.duck.value);

            if (this.duck.return === 1 && this.duck.value >= playerProp.duck.range) {
                this.duck.return = 0;
            } else if (this.duck.return === -1 && this.duck.value <= 0) {
                this.duck.value = 0;
                this.duck.time = 0;
                this.duck.return = 1;
                this.duck.animate = false;

                this.setPosition(playerProp.radius);
            }
        }
    }

    animateFall() {
        this.fall.scale -= playerProp.fall.scaleSpeed;
        this.fall.rotate.value += this.fall.rotate.direction * playerProp.fall.rotateSpeed;
        this.fall.rotate.speed += playerProp.fall.rotateSpeedIncrement;

        let dx = (this.fall.target.x - this.x) * playerProp.fall.speed;
        let dy = (this.fall.target.y - this.y) * playerProp.fall.speed;
        let distance = Math.hypot(dx, dy);

        if (distance > 5) {
            dx *= 5 / distance;
            dy *= 5 / distance;
        } else {
            this.fall.over = true;
        }

        this.x += dx;
        this.y += dy;
    }
}

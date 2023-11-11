class Player {
    constructor(index, name) {
        this.index = index;
        this.name = name;

        let isCurrentPlayer = this.index === playerIndex;
        let containerMargin = 20;
        this.y = isCurrentPlayer ? cvs.height - containerMargin : containerMargin;

        let hexagonR = 60;
        this.hexagon = {
            x: cvs.width / 2,
            y: this.y + hexagonR * (isCurrentPlayer ? -1 : 1),
            list: [],
            r: hexagonR,
            drag: false,
            direction: {
                x: 0,
                y: 0
            },
            translate: {
                x: 0,
                y: 0
            },
            rotate: {
                value: 0,
                speed: 10,
                animate: false
            }
        };

        let margin = 70;

        let defaultValue = 5000;
        let hpR = 50;
        this.hp = {
            value: defaultValue,
            defaultValue,
            target: defaultValue,
            increment: 20,
            x: isCurrentPlayer ? margin : cvs.width - margin,
            y: this.y + hpR * (isCurrentPlayer ? -1 : 1),
            r: hpR,
            borderWidth: 10,
            color: 'rgb(240,220,50)',
            secondaryColor: 'rgb(100,100,100)',
            backgroundColor: 'rgb(188,23,250)',
            textColor: 'white'
        };

        if (!isCurrentPlayer) {
            this.y += this.hp.r * 2;
        }

        this.attack = {
            damage: {
                value: 0,
                combo: 0
            },
            x: isCurrentPlayer ? cvs.width - margin : margin,
            animate: false,
            border: {
                width: 5,
                color: 'rgb(50,201,250)'
            },
            backgroundColor: 'black',
            laser: {
                color: 'red',
                increment: 2,
                w: 40,
                h: 0,
                speed: 19,
                opacity: 0,
                fadeSpeed: 0.065
            },
            text: {
                list: [],
                fadeSpeed: 0.013,
                moveSpeed: .6
            }
        };

        this.generateHexagon();
    }

    generateHexagon() {
        let hexagonQuantity = random(1, 2);

        let x = this.hexagon.x, y = this.hexagon.y;

        if (hexagonQuantity >= 2) {
            let sides = [5, 4, 0];
            let side = random(0, sides.length - 1);
            // let side = 2;
            let currentSide = sides[side];
            // console.log(side);
            let rad = (currentSide * 2 + 1) * Math.PI / 6;

            let dir = {
                x: hexagonSize.x * Math.cos(rad),
                y: hexagonSize.y * Math.sin(rad)
            };

            switch (side) {
                case 0:
                    dir.y -= hexagonSize.y;
                    break;
                case 1:
                    dir.x += hexagonSize.x * 1.8;
                    dir.y += hexagonSize.y;
                    break;
                case 2:
                    dir.y += hexagonSize.y;
                    break;
            }

            x -= dir.x / 2;
            y -= dir.y / 2;

            this.hexagon.direction = dir;

            this.hexagon.list.push(new Hexagon(x + dir.x, y + dir.y, random(1, 6)));
        } else {
            this.hexagon.direction = {
                x: 0,
                y: 0
            }
        }

        this.hexagon.list.push(new Hexagon(x, y, random(1, 6)));
    }

    swapHexagon() {
        if (this.hexagon.list.length > 1) {
            this.hexagon.rotate.animate = true;
        }
    }

    attackOpponent() {
        this.attack.animate = true;
    }

    setDamage(damage, combo = 1, x= 0, y = 0) {
        damage *= 100;

        let hpTarget = getOpponent(this.index).hp.value - damage * combo;
        getOpponent(this.index).hp.target = hpTarget < 0 ? 0 : hpTarget;

        this.attack.text.list.push({
            x: getOpponent(this.index).hp.x + x,
            y: getOpponent(this.index).hp.y + y,
            opacity: 1,
            damage, combo
        });
    }

    drawHexagon() {
        ctx.save();
        ctx.beginPath();

        ctx.arc(this.hexagon.x, this.hexagon.y, this.hexagon.r, 0, 2 * Math.PI);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        ctx.save();

        ctx.translate(this.hexagon.translate.x, this.hexagon.translate.y);
        this.hexagon.list.forEach(hexagon => {
            ctx.save();
            if (this.hexagon.rotate.animate) {
                ctx.translate(this.hexagon.list[0].x - this.hexagon.direction.x / 2, this.hexagon.list[0].y - this.hexagon.direction.y / 2);
            }

            ctx.rotate(degreeToRadian(this.hexagon.rotate.value));

            if (this.hexagon.rotate.animate) {
                ctx.translate(-this.hexagon.list[0].x + this.hexagon.direction.x / 2, -this.hexagon.list[0].y + this.hexagon.direction.y / 2);
            }
            hexagon.draw();
            ctx.restore();
        });

        ctx.restore();

        if (this.hexagon.rotate.animate) {
            if (this.hexagon.rotate.value < 180) {
                this.hexagon.rotate.value += this.hexagon.rotate.speed;

                if (this.hexagon.rotate.value > 180) {
                    this.hexagon.rotate.value = 180;
                }
            } else {
                this.hexagon.rotate.animate = false;
                this.hexagon.rotate.value = 0;

                let hexagonList = this.hexagon.list;

                let tempHexagon = {...hexagonList[0]};

                hexagonList[0].x = hexagonList[1].x;
                hexagonList[0].y = hexagonList[1].y;

                hexagonList[1].x = tempHexagon.x;
                hexagonList[1].y = tempHexagon.y;

                [hexagonList[0], hexagonList[1]] = [hexagonList[1], hexagonList[0]];
                // Check the game if game check sorting
            }
        }
    }

    drawHp() {
        ctx.save();
        ctx.beginPath();

        ctx.arc(this.hp.x, this.hp.y, this.hp.r, 0, 2 * Math.PI);

        ctx.fillStyle = this.hp.secondaryColor;
        ctx.fill();

        ctx.closePath();
        ctx.restore();

        let degree = 360 - this.hp.value / this.hp.defaultValue * 360;

        ctx.save();
        ctx.beginPath();

        ctx.moveTo(this.hp.x, this.hp.y);
        ctx.arc(this.hp.x, this.hp.y, this.hp.r, -90 * Math.PI / 180, degree ? degreeToRadian(degree - 90) : 1.5 * Math.PI, true);
        ctx.lineTo(this.hp.x, this.hp.y);

        ctx.closePath();

        ctx.fillStyle = this.hp.color;
        ctx.fill();

        ctx.restore();


        ctx.save();
        ctx.beginPath();

        ctx.arc(this.hp.x, this.hp.y, this.hp.r - this.hp.borderWidth, 0, 2 * Math.PI);

        ctx.fillStyle = this.hp.backgroundColor;
        ctx.fill();

        ctx.closePath();

        ctx.font = '20px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.hp.textColor;
        ctx.fillText(this.hp.value, this.hp.x, this.hp.y);

        ctx.fillText(this.name, this.hp.x, this.hp.y + (this.hp.r + 20) * (this.index === playerIndex ? -1 : 1));

        ctx.restore();

        if (this.hp.value > this.hp.target) {
            this.hp.value -= this.hp.increment;

            if (this.hp.value < this.hp.target) {
                this.hp.value = this.hp.target;
            }
        }
    }

    drawAttack() {
        ctx.save();
        ctx.beginPath();

        ctx.arc(this.attack.x, this.hp.y, this.hp.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.attack.backgroundColor;
        ctx.fill();

        ctx.strokeStyle = this.attack.border.color;
        ctx.lineWidth = this.attack.border.width;
        ctx.stroke();

        ctx.closePath();
        ctx.restore();

        if (this.attack.animate) {
            let distance = Math.abs(players[0].hp.y - players[1].hp.y);

            ctx.save();
            ctx.beginPath();

            if (distance - this.attack.laser.h <= 0) ctx.globalAlpha = this.attack.laser.opacity;
            ctx.fillStyle = this.attack.laser.color;
            ctx.translate(-this.attack.laser.w / 2, playerIndex === this.index ? -this.attack.laser.h : 0);
            ctx.fillRect(this.attack.x, this.hp.y, this.attack.laser.w, this.attack.laser.h);

            ctx.closePath();
            ctx.restore();

            if (distance - this.attack.laser.h <= 0) {
                if (!this.attack.laser.opacity) {
                    this.attack.laser.h = distance;
                    this.attack.laser.opacity = 1;

                    this.setDamage(this.attack.damage.value, this.attack.damage.combo);
                }

                this.attack.laser.opacity -= this.attack.laser.fadeSpeed;
            } else {
                this.attack.laser.h += this.attack.laser.speed;
            }

            if (this.attack.laser.opacity < 0) {
                this.attack.laser.h = 0;
                this.attack.laser.opacity = 0;
                this.attack.animate = false;
            }
        }

        this.attack.text.list.forEach((text, index) => {
            ctx.save();

            ctx.globalAlpha = text.opacity;
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.globalAlpha = text.opacity;

            let damageText = '-' + text.damage + (text.combo > 1 ? ' x' + text.combo : '');

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(255,50,50)';
            ctx.strokeText(damageText, text.x, text.y);

            ctx.fillStyle = 'rgb(230,210,50)';
            ctx.fillText(damageText, text.x, text.y);

            ctx.restore();

            text.y += this.attack.text.moveSpeed * (playerIndex === this.index ? 1 : -1);
            text.opacity -= this.attack.text.fadeSpeed;

            if (text.opacity < 0) {
                this.attack.text.list.pop();
            }
        });
    }

}

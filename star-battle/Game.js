class Game {
    constructor() {
        this.volume = localStorage.getItem('star-battle-audio') == null ? 1 : localStorage.getItem('star-battle-audio') || 1;
    }

    //  Starting Game

    start(GOD_MODE = false) {
        this.GOD_MODE = GOD_MODE;

        this.sound = new Audio();
        this.sound.src = './sound/background.mp3';
        this.sound.loop = true;
        this.sound.volume = this.volume;

        //  Declaring Objects
        this.backgroundPosition = 0;

        this.animateCanvas = null;

        //  Particles

        this.particles = [];

        //  Planets

        this.planets = [];

        for (let i = 0; i < 5; i++) {
            this.planets.push(new Planet(i + 1));
        }

        //  Enemies

        this.enemies = [];

        //  Player

        this.player = new Player();

        // Shop ship

        this.shopShip = new ShopShip();

        // Shop

        this.shop = new Shop();
        this.shop.displayData();

        //  Fuel

        this.fuel = new Fuel();

        // Equiment

        this.equipment = new Equipment();

        this.pause = -1;

        //  Declaring Stats

        this.stats = {
            time: 0,
            countTime: 0,
            score: 0,
            fuel: this.player.stats.fuel,
            distance: 0,
            level: 0,
            shopTime: this.shopShip.shopTimeDefault,
            coins: 9999999,
            combo: 0,
            comboText: 0,
        };

        this.enemyGenerator(true);

        this.IS_CHANGING_LEVEL = false;

        //  Clear Previous Game

        if (this.rendering) cancelAnimationFrame(this.rendering);

        this.rendering = null;

        ev.hideExcept('#gameBoard');
        $('#zone_joystick').removeClass('hide');
        ev.showCanvas(1);

        let zoneJoystick = document.getElementById('zone_joystick');

        let joystick = nipplejs.create({
            zone: zoneJoystick,
            mode: 'static',
            position: {left: '50%', top: '50%'},
            color: 'white',
            size: 100,
        });

        joystick.on('start end', function (evt, data) {
            moveJoystick(data)
        }).on('move', function (evt, data) {
            moveJoystick(data)
        }).on('dir:up plain:up dir:left plain:left dir:down ' +
            'plain:down dir:right plain:right',
            function (evt, data) {
                moveJoystick(data)
            }
        ).on('pressure', function (evt, data) {
            moveJoystick(data)
        });

        $('#shop').css('opacity', '0');

        setTimeout(() => {
            $('#shop').css('opacity', '1');
        }, 600);

        this.render = this.render.bind(this);
        this.render();
    }

    // Rendering Game

    render() {
        if (this.pause === -1) {
            this.sound.volume = this.volume;
            this.sound.onload = () => {
                this.sound.play();
            };

            this.animateBackground();

            //  Clearing Canvas

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //  Rendering Planets

            for (let i = 0; i < this.planets.length; i++) {
                this.planets[i].render()
            }

            //  Rendering Friend

            this.field_is_empty = true;

            //  Rendering Enemy

            for (let i = 0; i < this.enemies.length; i++) {
                let enemy = this.enemies[i];
                for (let j = 0; j < enemy.bullets.length; j++) {
                    let bullet = enemy.bullets[j];
                    bullet.render();

                    if (this.player.touchable && this.checkCollision(bullet, this.player)) {
                        enemy.bullets.splice(j, 1);
                        this.planeCollided();
                    }
                }

                enemy.render();

                if (this.player.touchable && this.checkCollision(enemy, this.player)) {
                    this.planeCollided(enemy);
                }

                if (enemy.x + enemy.width > 0) this.field_is_empty = false;
            }

            //  Rendering Fuel

            if (this.fuel.status) {
                this.fuel.render();

                if (this.checkCollision(this.fuel, this.player)) {
                    this.stats.fuel += 15;
                    this.fuel.generateLocation();
                }
            }

            //  Rendering Player's Bullets

            for (let i = 0; i < this.player.bullets.length; i++) {
                let bullet = this.player.bullets[i];
                bullet.render();

                if (bullet.x > canvas.width) {
                    this.player.bullets.splice(i, 1);
                } else if (bullet.x < canvas.width) {
                    for (let j = 0; j < this.enemies.length; j++) {
                        let enemy = this.enemies[j];
                        if (this.checkCollision(bullet, enemy)) {
                            this.player.bullets.splice(i, 1);
                            this.collided(enemy, bullet);
                        }
                    }
                }
            }

            //  Rendering Player Fire Effects

            this.player.renderFireEffects();

            //  Rendering Player

            this.player.render();

            //  Rendering Particles

            for (let i = 0; i < this.particles.length; i++) {
                let particle = this.particles[i];
                particle.render();

                if (particle.opacity <= 0) this.particles.splice(i, 1);
            }

            // Rendering Shop Ship

            this.shopShip.render();

            //  Count Time

            this.countTime();
            this.renderText();

            if (this.stats.distance % 500 === 0) this.enemyGenerator();

            if (this.stats.fuel <= 0) {
                this.over();
            }
        } else {
            this.sound.pause();
        }

        //  Looping Animation
        this.rendering = requestAnimationFrame(this.render);
    }

    planeCollided(obj = null) {
        // Handle Plane Collided
        if (obj && !obj.boss) {
            obj.life = 0;
            this.collided(obj);
        }

        game.stats.combo = 0;
        game.stats.comboText = 0;
        $('.game-combo').html('');

        this.player.sound.volume = this.volume;
        this.player.sound.play();
        $('.collide-animation').addClass('animate-canvas');
        this.player.touchable = 0;

        if (this.animateCanvas) clearTimeout(this.animateCanvas);

        this.animateCanvas = setTimeout(() => {
            this.player.touchable = 1;
            $('.collide-animation').removeClass('animate-canvas');
        }, 1500);

        this.stats.fuel -= 15;
    }

    collided(obj, bullet = null) {
        // Handle Collided Object
        if (bullet) {
            obj.life -= bullet.power * game.player.stats.bullet;
            if (obj.score > 0) {
                game.stats.combo += bullet.power * game.player.stats.bullet;
            } else {
                game.stats.combo = 0;
                game.stats.comboText = 0;
                $('.game-combo').html(``);
            }
        } else {
            game.stats.combo = 0;
            game.stats.comboText = 0;
            $('.game-combo').html(``);
        }

        if (obj.life <= 0) {
            this.particles.push(new Particle(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.coins, obj.score));
            obj.sound.volume = this.volume;
            obj.sound.play();
            this.stats.score += obj.score;
            this.stats.coins += obj.coins;
            if (obj.boss) obj.destroy(); else obj.generateLocation();
        }
    }

    checkCollision(a, b) {
        // Checking Collision
        a = a.collision || a;
        b = b.collision || b;
        if (a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y) return 1;
        return 0;
    }

    renderText() {
        //  Rendering Stats
        if (this.stats.fuel > this.player.stats.fuel) this.stats.fuel = this.player.stats.fuel;
        else if (this.stats.fuel < 0) this.stats.fuel = 0;

        $('.score-text').html(this.stats.score);
        $('.coins-text').html(this.stats.coins);
        $('.time-text').html(this.stats.time);
        $('.shopTime-text').html(this.stats.shopTime);
        $('#shop .coins span').html(this.stats.coins);

        $('#fuel').html(this.stats.fuel).css('width', (this.stats.fuel / this.player.stats.fuel * 100) + '%');

        if (!this.IS_CHANGING_LEVEL) this.stats.distance++;

        if (this.stats.comboText < this.stats.combo) {
            this.stats.comboText++;
            $('.game-combo').html(`${game.stats.comboText} combo`);
        }
    }

    countTime() {
        //  Counting Time

        let stats = this.stats;

        stats.countTime++;

        if (stats.countTime % 60 === 0) {
            stats.time++;
            stats.fuel--;
            if (stats.shopTime) stats.shopTime--;
        }
    }

    animateBackground() {
        //  Animating Background

        $('.container').css('background-position', this.backgroundPosition + 'px');

        this.backgroundPosition--;
    }

    //  Game Over

    over() {
        if (!this.GOD_MODE) {
            this.sound.pause();
            this.pause = 1;
            $('#zone_joystick').html('');
            cancelAnimationFrame(this.rendering);

            ev.hideExcept('#scoreForm');
            ev.showCanvas(0);
        }
    }

    // random number generators
    enemyGenerator(change_now = false) {
        if (!change_now) {
            this.IS_CHANGING_LEVEL = true;
            if (this.field_is_empty) {
                if (!this.level_timeout) {
                    this.level_timeout = setTimeout(() => {
                        this.changeLevel();
                    }, 1000);
                }
            }
        } else {
            if (!this.level_timeout) {
                this.level_timeout = setTimeout(() => {
                    this.changeLevel();
                }, 1000);
            }
        }
    }

    changeLevel() {
        this.stats.level += 1;

        this.enemies = [];

        let s = ``;

        if (this.stats.level % 5 === 0) s += `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" class="alert-animation" fill="#fff" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>
                        <h2>Stage ${this.stats.level}! The Boss is waiting for you!</h2>`
        else s = `<h2>Get Ready! Stage ${this.stats.level} is about to start</h2>`;

        $('.level-info').html(s).addClass('popup-animation');

        setTimeout(() => {
            $('.level-info').removeClass('popup-animation');

            if (this.stats.level % 5 !== 0) {
                let level = new Level(this.stats.level);

                for (let i = 0; i < 2; i++) {
                    this.enemies.push(new Enemy(3, 0));
                }

                for (let i = 0; i < level.maxEnemy; i++) {
                    this.enemies.push(new Enemy(1, this.stats.level));
                }

                for (let i = 0; i < level.maxAsteroid; i++) {
                    this.enemies.push(new Enemy(2, this.stats.level));
                }

                this.stats.distance += 1;
            } else {
                this.enemies.push(
                    new Boss()
                );
            }

            this.IS_CHANGING_LEVEL = false;
            this.level_timeout = null;
        }, 5000);
    }

    search(key, array){
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === key) {
                return array[i];
            }
        }
    }
}
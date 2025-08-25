class ShopShip {
    constructor() {
        this.width = 120;
        this.height = 75;

        this.x = 0;
        this.y = 50;

        this.speed = 10;

        this.img = new Image();
        this.img.src = './assets/shopShip.png';

        this.resetXLocation();

        this.arrivedLocationX = 120;

        this.arrived = false;
        this.mode = 'arriving';

        this.shopTimeDefault = 0;

        this.waitingTime = 5000;

        this.shopTimeout = null;
    }

    resetXLocation() {
        this.x = -50 - this.width;
    }

    render() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

        if (!game.stats.shopTime && this.mode !== 'shopping') {
            this[this.mode]();
        }
    }

    arriving() {
        if (this.x < this.arrivedLocationX) {
            this.x += this.x + this.speed > this.arrivedLocationX ? this.arrivedLocationX - this.x : this.speed;
        } else {
            this.enterZoneChecking();
            if (!this.arrived) {
                this.arrived = true;
                ev.toggleEnterZone();

                this.shopTimeout = setTimeout(() => {
                    this.leave();
                }, this.waitingTime);
            }
        }
    }

    leave(){
        this.arrived = false;
        let enterZone = $('.enter-zone');
        enterZone.css('animation', 'none');
        setTimeout(() => {
            enterZone.removeClass('active')
            game.player.touchable = 1;
        }, 40);
        this.mode = 'leaving';
    }

    leaving() {
        if (this.arrived) {
            this.leave();
        }

        if (this.x < canvas.width) {
            this.x += this.speed;
        } else {
            this.arrived = false;
            this.resetXLocation();
            this.resetShopTime();

            this.mode = 'arriving';
        }
    }

    resetShopTime() {
        game.stats.shopTime = this.shopTimeDefault;
    }

    shopping() {
        if (this.arrived) {
            ev.toggleShop();
        }
    }

    enterZoneChecking(){
        let x = game.player.x + game.player.width / 2;
        let y = game.player.y + game.player.height / 2;

        let enterZoneRect = document.querySelector('.enter-zone').getBoundingClientRect();

        if(x >= enterZoneRect.left && x <= enterZoneRect.right && y >= enterZoneRect.top && y <= enterZoneRect.bottom && this.mode !== 'shopping'){
            clearTimeout(this.shopTimeout);
            game.player.setEnteringShop();
            this.mode = 'shopping';
        }
    }
}
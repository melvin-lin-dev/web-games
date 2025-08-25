class Shop {
    constructor() {
        this.menus = [
            {
                name: 'Stats',
                type: 'stats',
                menuType: 'upgrade',
                image: imageAssets['stats.png'],
                data: [
                    {
                        name: 'Fuel',
                        type: 'fuel',
                        image: this.loadShopImage('fuel.png'),
                        description: 'Ship HP',
                        cost: 200
                    },
                    {
                        name: 'Bullet',
                        type: 'bullet',
                        image: this.loadShopImage('bullet.png'),
                        description: 'Ship HP',
                        cost: 200
                    }
                ]
            },
            {
                name: 'Bullet',
                type: 'bullet',
                menuType: 'equipment',
                image: imageAssets['bullet.png'],
                data: [
                    {
                        name: 'Original',
                        type: 'original',
                        image: this.loadShopImage('bullet.png'),
                        description: 'Original Bullet',
                        cost: 0,
                        equipmentType: 1,
                        owned: true
                    },
                    {
                        name: 'Rocket',
                        type: 'rocket',
                        image: this.loadShopImage('rocket.png'),
                        description: 'Rocket',
                        cost: 400,
                        equipmentType: 2,
                        owned: false
                    }
                ]
            },
            {
                name: 'Exhaust',
                type: 'exhaust',
                menuType: 'equipment',
                image: imageAssets['exhaust_1.png'],
                data: [
                    {
                        name: 'Original',
                        type: 'original',
                        image: this.loadShopImage('exhaust_1.png'),
                        description: 'Original Exhaust',
                        cost: 0,
                        equipmentType: 1,
                        owned: true
                    },
                    {
                        name: 'Blue Exhaust',
                        type: 'exhaust_2',
                        image: this.loadShopImage('exhaust_2.png'),
                        description: 'Exhaust-2',
                        cost: 500,
                        equipmentType: 2,
                        owned: false
                    }
                ]
            }
        ];

        // this.data = [
        //     {
        //         name: 'Fuel',
        //         type: 'fuel',
        //         image: imageAssets['fuel.png'],
        //         description: 'Ship HP',
        //         cost: 200
        //     },
        //     {
        //         name: 'Bullet',
        //         type: 'bullet',
        //         image: imageAssets['bullet.png'],
        //         description: 'Weapon',
        //         cost: 300
        //     },
        // ];

        this.music = new Audio('./sound/shop.mp3');
    }

    displayData(side = 'top', parentMenu = '', el = '') {
        let contentMenu = $(`.menu.${side} .content-menu`);
        if (side === 'bottom') {
            $('.shop-container .content-menu .active').removeClass('active');
            el.classList.add('active');
            $('.menu.bottom').addClass('active');
            $('.menu.bottom').prop('id', 'menu-' + parentMenu.type);
        } else if (side === 'top') {
            this.setUpgradeBar();
        }
        contentMenu.html('');

        let list = side === 'top' ? this.menus : parentMenu.data;

        let _self = this;

        list.forEach(menu => {
            let type = document.createElement('div');
            type.onclick = function () {
                if (side === 'top') {
                    $('.shop-container .inspect.equipment').removeClass('active');
                    _self.displayData('bottom', menu, this);
                } else if(parentMenu.menuType === 'equipment') {
                    _self.inspectEquipment(menu, parentMenu.type);
                }
            };

            let name = document.createElement('span');
            name.innerHTML = menu.name;

            let div = document.createElement('div');

            contentMenu.append(type);
            type.appendChild(name);
            type.appendChild(div);
            div.appendChild(menu.image);

            if (side === 'bottom') {
                let currentUpgrade = game.player.upgrade[menu.type];
                let buyButton = document.createElement('button');

                buyButton.value = menu.cost;
                if (parentMenu.menuType === 'upgrade') {
                    buyButton.innerHTML = currentUpgrade.upgradeLevel === currentUpgrade.maxUpgrade ? 'MAXED' : menu.cost * (currentUpgrade.upgradeLevel + 1);
                    buyButton.value *= currentUpgrade.upgradeLevel + 1;
                } else if (parentMenu.menuType === 'equipment') {
                    buyButton.innerHTML = menu.owned ? 'EQUIP' : 'BUY';
                    if (game.player.bulletType === menu.equipmentType) {
                        buyButton.innerHTML = 'EQUIPPED';
                    }
                }
                buyButton.className = `btn`;
                buyButton.onclick = (e) => {
                    this.checkMenuType(e.target, parentMenu, menu);
                };
                type.appendChild(buyButton);
            }
        })
    }

    checkMenuType(button, parentMenu, menu){
        if(game.stats.coins >= button.value){
            let currentUpgrade = game.player.upgrade[menu.type];

            if((parentMenu.menuType === 'equipment' && !menu.owned) || (parentMenu.menuType === 'upgrade' && currentUpgrade.upgradeLevel < currentUpgrade.maxUpgrade)){
                game.stats.coins -= button.value;

                game.renderText();

                let kachingSound = new Audio('./sound/kaching.mp3');
                kachingSound.play();

                let effect = document.createElement('img');
                effect.src = './assets/coin.png';
                $('#shop .bought-effects').append(effect);

                setTimeout(() => {
                    effect.remove();
                }, 1400);
            }

            switch(parentMenu.menuType) {
                case 'upgrade':
                    this.upgradeShip(button, menu, currentUpgrade);
                    break;
                case 'equipment':
                    this.buyEquipment(button, menu, currentUpgrade, parentMenu.type);
                    break;
            }
        }else{
            $('#shop .notification').addClass('active');

            setTimeout(() => {
                $('#shop .notification').removeClass('active');
            }, 1000);
        }
    }

    loadShopImage(imageName) {
        let newImage = new Image();
        newImage.src = imageAssets[imageName].src;
        return newImage;
    }

    upgradeShip(button, menu, currentUpgrade) {
        if (currentUpgrade.upgradeLevel < currentUpgrade.maxUpgrade) {
            currentUpgrade.upgradeLevel++;
            game.player.stats[menu.type] += currentUpgrade.value;

            let innerHTML = '';

            if (currentUpgrade.upgradeLevel === currentUpgrade.maxUpgrade) {
                innerHTML = 'MAXED';
            } else {
                innerHTML = menu.cost * (currentUpgrade.upgradeLevel + 1)
            }

            button.value = menu.cost * (currentUpgrade.upgradeLevel + 1);

            button.innerHTML = innerHTML;
            this.setUpgradeBar(menu.type);
        }
    }

    buyEquipment(button, menu, currentUpgrade, parentMenuType){
        if(!menu.owned){
            button.value = 0;
            menu.cost = 0;
            menu.owned = true;
        }

        $(`#menu-${parentMenuType} button[value=0]`).html('EQUIP');
        button.innerHTML = 'EQUIPPED';
        game.player.equipment[parentMenuType] = menu.equipmentType;
    }

    inspectEquipment (menu, parentMenuType) {
        let equipmentStats = $('.shop-container .inspect.equipment');
        let timeout = equipmentStats.hasClass('active') ? 400 : 0;

        equipmentStats.removeClass('active');

        setTimeout(() => {
            equipmentStats.addClass('active');

            equipmentStats.html('');

            for(let statType in game.equipment.maxStats[parentMenuType]){
                let targetStat = game.equipment.stats[parentMenuType][menu.equipmentType][statType];
                let maxStat = game.equipment.maxStats[parentMenuType][statType];
                let currentStat =  game.equipment.stats[parentMenuType][game.player.equipment[parentMenuType]][statType];
                let isStatIncrease = targetStat > currentStat;
                let statColor = isStatIncrease ? 'rgba(50,210,0,.7)' : 'rgba(220,50,0,.7)';

                let equipmentStat = document.createElement('div');
                // stat.id = `stat-${type}`;

                let name = document.createElement('span');
                name.innerHTML = statType.toUpperCase();

                let point = document.createElement('span');
                if(targetStat !== currentStat)
                    point.innerHTML = (isStatIncrease ? '+' : '') + (targetStat - currentStat).toFixed(2).toString();
                point.style.color = statColor.replace('.7','1');

                let progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';

                let progressBarMax = document.createElement('div');
                progressBarMax.className = 'max';
                progressBarMax.style.width = 0;
                let progressBarMin = document.createElement('div');
                progressBarMin.className = 'min';
                progressBarMin.style.width = 0;

                equipmentStats.append(equipmentStat);
                equipmentStat.appendChild(name);
                name.appendChild(point);
                equipmentStat.appendChild(progressBar);
                progressBar.appendChild(progressBarMax);
                progressBar.appendChild(progressBarMin);

                setTimeout(() => {
                    progressBarMax.style.backgroundColor = statColor;
                    progressBarMax.style.width = (isStatIncrease ? targetStat : currentStat) / maxStat * 100 + '%';
                    progressBarMin.style.width = (isStatIncrease ? currentStat : targetStat) / maxStat * 100 + '%';
                }, 400);
            }
        }, timeout);
    }

    setUpgradeBar(type = '') {
        if (!type) {
            let stats = $('.shop-container .inspect.stats');
            stats.html('');

            for (let type in game.player.upgrade) {
                let currentUpgrade = game.player.upgrade[type];

                let stat = document.createElement('div');
                // stat.id = `stat-${type}`;

                let name = document.createElement('span');
                name.innerHTML = type.toUpperCase() + ` (${currentUpgrade.upgradeLevel})`;

                let progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';

                let progressBarDiv = document.createElement('div');

                stats.append(stat);
                stat.appendChild(name);
                stat.appendChild(progressBar);
                progressBar.appendChild(progressBarDiv);

                progressBarDiv.style.width = currentUpgrade.upgradeLevel / currentUpgrade.maxUpgrade * 100 + '%';
            }
        } else {
            let currentUpgrade = game.player.upgrade[type];
            $(`#shop #stat-${type} span`).html(`${type.toUpperCase()} (${currentUpgrade.upgradeLevel})`);
            $(`#shop #stat-${type} .progress-bar > div`).css('width', currentUpgrade.upgradeLevel / currentUpgrade.maxUpgrade * 100 + '%');
        }
    }

    toggleMusic(){
        if(this.music.currentTime === 0){
            this.music.play();
            this.music.volume = game.volume;
            this.music.loop = true;
        }else{
            this.music.pause();
            this.music.currentTime = 0;
        }
    }
}
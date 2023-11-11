let itemData = {
    block: {
        dirt: {
            breakTime: 7,
            walkable: false,
        },
        stone: {
            breakTime: 40,
            walkable: false,
        },
        wood: {
            breakTime: 13,
            walkable: true,
        },
        leaves: {
            breakTime: 2,
            walkable: true,
        },
        sky: {
            walkable: true
        }
    },
    drop: {}
};

class Item {
    constructor() {
        this.loadItems();
    }

    loadItems() {
        let loaderContainer = document.querySelector('.loader-container');
        // loaderContainer.classList.add('active');

        let xmlHttp = new XMLHttpRequest();

        let self = this;

        xmlHttp.onreadystatechange = function () {
            if (this.status === 200 && this.readyState === 4) {
                setTimeout(() => {
                    loaderContainer.classList.remove('active');
                }, 0);

                let itemTypes = JSON.parse(this.responseText);
                self.convertToObject(itemTypes);

                start();
            }
        };

        xmlHttp.open('GET', './assets/php/main.php', true);
        xmlHttp.send()
    }

    convertToObject(itemTypes) {
        for (let type in itemTypes) {
            itemTypes[type].forEach(item => {
                let itemType = item.split('.')[0];

                let image = new Image();
                image.src = `${assets.image[type]}/${item}`;

                this[itemType] = {
                    ...this[itemType],
                    [type]: {
                        ...itemData[type][itemType],
                        image,
                    }
                }
            })
        }
    }
}

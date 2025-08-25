let imageAssets = {};
let audioAssets = {};

function loadAssets(items, onComplete) {
    let loaded = 0;

    function onLoad() {
        loaded++;

        $('.loader-item').css('width', (loaded / items.length) * 100 + '%');

        if (loaded == items.length) {
            onComplete();
        }
    }

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.type == 'image') {
            let img = new Image();
            img.onload = onLoad;
            img.src = './assets/' + item.value;
            imageAssets[item.value] = img;
        } else if (item.type == 'audio') {
            let audio = new Audio();
            audio.oncanplaythrough = onLoad;
            audio.src = './sound/' + item.value;
            audioAssets[item.value] = audio
        }
    }
}

loadAssets([
    {
        value: 'plane.png',
        type: 'image',
    },
    {
        value: 'fuel.png',
        type: 'image',
    },
    {
        value: 'bullet.png',
        type: 'image',
    },
    {
        value: 'exhaust_1.png',
        type: 'image',
    },
    {
        value: 'exhaust_2.png',
        type: 'image',
    },
    {
        value: 'ship_2.png',
        type: 'image',
    },
    {
        value: 'ship_3.png',
        type: 'image',
    },
    {
        value: 'asteroid.png',
        type: 'image',
    },
    {
        value: 'planet_1.png',
        type: 'image',
    },
    {
        value: 'planet_2.png',
        type: 'image',
    },
    {
        value: 'planet_3.png',
        type: 'image',
    },
    {
        value: 'planet_4.png',
        type: 'image',
    },
    {
        value: 'planet_5.png',
        type: 'image',
    },
    {
        value: 'coin.png',
        type: 'image',
    },
    {
        value: 'shopShip.png',
        type: 'image'
    },
    {
        value: 'bullet.png',
        type: 'image'
    },
    {
        value: 'enemy1.svg',
        type: 'image'
    },
    {
        value: 'enemy2.svg',
        type: 'image'
    },
    {
        value: 'enemy3.svg',
        type: 'image'
    },
    {
        value: 'enemy4.svg',
        type: 'image'
    },
    // {
    //     value: 'background.mp3',
    //     type: 'audio',
    // },
    // {
    //     value: 'shoot.mp3',
    //     type: 'audio',
    // },
    // {
    //     value: 'destroyed.mp3',
    //     type: 'audio',
    // },
    // {
    //     value: 'kaching.mp3',
    //     type: 'audio',
    // },
    {
        value: 'fire-effect_1.png',
        type: 'image',
    },
    {
        value: 'fire-effect_2.png',
        type: 'image',
    },
    {
        value: 'exit.png',
        type: 'image',
    },
    {
        value: 'stats.png',
        type: 'image',
    },
    {
        value: 'rocket.png',
        type: 'image',
    },
    {
        value: 'rocket-exhaust.png',
        type: 'image',
    },
], complete);

function complete() {
    $('.loader').addClass('hide')
}
let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let blockSize = 50;
let xBlocks = 40;
let yBlocks = 30;

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let drops = [];

let assets = {
    image: {
        skin: './assets/images/skin',
        block: './assets/images/block',
        drop: './assets/images/drop',
        status: './assets/images/status'
    }
};

let images;

let blocks = [];

let item, formula, player, inventory;

let move = {left: false, right: false, up: false};

let startLand = Math.ceil(yBlocks / 2);

function start() {
    formula = new Formula();
    player = new Player();
    inventory = new Inventory();

    inventory.generateInventory();
    generateBlocks();

    update();
}

function update() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    player.move();

    checkCollisions();

    draw();

    requestAnimationFrame(update);
}

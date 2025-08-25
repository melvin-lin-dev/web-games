const socket = io();

let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth / 2.5;
cvs.height = window.innerHeight;

let hexagons = {};
let hexagonSize = 25;
hexagonSize = {
    x: hexagonSize,
    y: hexagonSize * 1.1
};

let gameOver;

let hexagonMargin = {
    x: hexagonSize.x * 2,
    y: hexagonSize.y * 1.7
};

let players = [];
let playerIndex = 0;

let hexagonColor = {
    1: 'rgb(77,103,230)',
    2: 'rgb(250,220,20)',
    3: 'rgb(211,18,174)',
    4: 'rgb(66,181,230)',
    5: 'rgb(199,64,24)',
    6: 'rgb(27,206,73)'
};

function start() {
    generateBoard();
    generatePlayers();


    animate();
}

function animate() {
    update();

    checkEmptySpace();

    requestAnimationFrame(animate);
}

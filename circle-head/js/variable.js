let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

const instructionContainer = document.querySelector('.instruction-container');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let move = {
    left: false,
    up: false,
    down: false,
    right: false,
};

let zombies = [];

let player;

const waveData = {
    1: 3,
    2: 6,
    3: 10,
    4: 15,
    5: 'boss',
    6: 'infinite'
};

let zeroFillDigits = 9;
let zeroFill = '';
let status = {
    wave: {
        value: 0,
        fontSize: {
            value: 0,
            target: 100,
            speed: 5,
        },
        isShow: false,
        show: false,
    },
    score: {
        value: 0,
        target: 0
    }
};

let particles = [];

let gameStart = false;
let gameOver = false;

let countDown = {
    value: 3,
    interval: '',
    el: document.querySelector('.count-down')
};

let gameOverContainer = document.querySelector('.game-over-container');

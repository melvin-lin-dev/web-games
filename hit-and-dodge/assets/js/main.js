let socket = io();

let playerContainer = document.querySelector('.player-container');
let startContainer = document.querySelector('.start-container');
let createRoomContainer = document.querySelector('.create-room-container');
let countdownContainer = document.querySelector('.countdown-container');
let gameOverContainer = document.querySelector('.game-over-container');

let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let planet = {
    r: (cvs.width > cvs.height ? cvs.height : cvs.width) / 2 - 100
};

let players = [], playerIndex;
let playerProp = {
    radius: planet.r + 20,
    image: {
        img: new Image(),
        scale: .3,
        size: {
            width: null,
            height: null
        }
    },
    weapon: {
        image: {
            img: new Image(),
            scale: .3,
            size: {
                width: null,
                height: null
            }
        },
        hit: {
            moveSpeed: 10,
            range: 100,
            speed: 12
        }
    },
    shield: {
        r: null,
        gradient: ctx.createRadialGradient(0, 0, 5, 0, 50, 110),
        collideGradient: ctx.createRadialGradient(0, 0, 0, 0, 50, 100)
    },
    duck: {
        speed: 10,
        range: 60,
        time: 35
    },
    fall: {
        speed: 1,
        scaleSpeed: 0.02,
        rotateSpeed: 2,
        rotateSpeedIncrement: 10
    }
};
playerProp.image.img.src = 'images/character.png';
playerProp.weapon.image.img.src = 'images/weapon.png';

playerProp.shield.gradient.addColorStop(0, 'rgba(255,255,255,0)');
playerProp.shield.gradient.addColorStop(1, 'rgb(50,200,240)');

playerProp.shield.collideGradient.addColorStop(0, 'rgba(255,50,50,.5)');
playerProp.shield.collideGradient.addColorStop(1, 'rgb(50,200,240)');

let ball;

let fallMargin = ((cvs.width > cvs.height ? cvs.height : cvs.width) / 2 - planet.r) / 2 + planet.r;

let gameOver = false;

let instructions = [
    'Press C to DODGE & Press SPACE to HIT',
    'Ball will getting faster each time it get it',
    'Ball will slowdown if the ball hit someone',
    'If you didn\'t input your name, your name will be automatically assigned to "Player"'
];

function initialization() {
    generateInstructions();
    generatePlayerStatus();

    playerProp.image.size.width = playerProp.image.img.width * playerProp.image.scale;
    playerProp.image.size.height = playerProp.image.img.height * playerProp.image.scale;

    playerProp.shield.r = (playerProp.image.size.width > playerProp.image.size.height ? playerProp.image.size.width : playerProp.image.size.height) / 2 + 20;

    playerProp.weapon.image.size.width = playerProp.weapon.image.img.width * playerProp.weapon.image.scale;
    playerProp.weapon.image.size.height = playerProp.weapon.image.img.height * playerProp.weapon.image.scale;
}

function start() {
    animate();
}

function animate() {
    if(!gameOver){
        update();
        checkCollideZone();

        checkGameOver();

        requestAnimationFrame(animate);
    }
}

function restart() {
    location.reload();
}

function createRoom() {
    let lengthId = 8;
    let roomId = socket.id.substr(socket.id.length / 2 - lengthId / 2, lengthId);

    socket.emit('room_create', {
        roomId,
        name: startContainer.querySelector('.name-input').value
    });
}

function joinRoom() {
    socket.emit('room_join', {
        roomId: document.querySelector('.room-id-input').value,
        name: startContainer.querySelector('.name-input').value
    });
}

function leaveRoom() {
    socket.emit('room_leave');
}

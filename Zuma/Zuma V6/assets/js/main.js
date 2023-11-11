let socket = io();

let canvas = document.querySelector('canvas');
let context = {};
let cvs = {};

let screenContainer = document.querySelector('.screen-container');
let mainContainer = document.querySelector('.main-container');
let gameOverContainer = document.querySelector('.game-over-container');
let scoreEl = document.querySelector('.score-container span');

let svg = document.querySelector('svg');
// svg.setAttribute('width', canvas.width = screen.width / 2);
// svg.setAttribute('height', canvas.height = screen.height);
svg.setAttribute('width', canvas.width = cvs.width = window.innerWidth / 2);
svg.setAttribute('height', canvas.height = cvs.height = window.innerHeight);
let path = document.querySelector('path');
let pathLength;

let players = {}, player, playerIndex;
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let playerSize = {
    width: 0,
    height: 0
};

let ball = {
    r: 18,
    speed: .8,
    startSpeed: 11,
    reverseSpeed: 3.85,
    gameOverSpeed: 20,
    shootSpeed: 15,
    margin: 0,
    startMargin: 0,
    setBackMultiplier: 1
};
let fastPhaseTime = 41;
let startingPhase = true;
let resetTimer = false;

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = {
    0: [],
    1: []
}, balls = {
    0: [],
    1: [],
}, particles = {
    0: [],
    1: [],
}, scores = {
    0: [],
    1: [],
}, lightTrails = {
    0: [],
    1: [],
}, scoreMultiplier = {
    0: 0,
    1: 0
};

let color = 'gold';

let endProp = {
    r: 50,
    range: 20,
    value: 100
};

let end = {
    0: {
        el: document.querySelector('.end'),
        milliseconds: 0
    },
    1: {
        el: null,
        milliseconds: 0
    }
};
let scale = 5000;

let milliseconds = 0;

let lightTrail = {
    quantity: 10,
    r: 6.5,
    speed: 15,
    margin: ball.startSpeed * 0.2,
    color: 'yellow',
    sound: new Tone.Buffer(`sounds/effect/lighttrail2.ogg`),
    pitch: {
        value: 0,
        shiftSpeed: .1,
        min: -10,
        default: -.5
    },
    playbackRate: {
        value: 0.9,
        shiftSpeed: .002,
        max: 1.3
    },
    interval: null,
    milliseconds: 0
};

let gameOver = null, gameStart = false;
let render = true;
let gameInterval;

let reverseBallIndexes = {
    0: [],
    1: []
};

let savedLocation = {};

let breakSound = new Tone.Buffer(`sounds/effect/chime1.ogg`);
let toneSound = {
    lightTrail: {
        pitchShift: new Tone.PitchShift().toDestination(),
        tone: null
    },
    break: {
        pitchShift: new Tone.PitchShift().toDestination(),
        tone: null
    }
};

let backgroundMusic = null;

function initialization() {
    let sizeScale = 0.55;
    playerSize.width = frogImage.width * sizeScale;
    playerSize.height = frogImage.height * sizeScale;

    path.style.strokeWidth = ball.r * 2;

    let clonePath = path.cloneNode(true);
    svg.insertBefore(clonePath, path);
    clonePath.style.strokeWidth = +clonePath.style.strokeWidth + 12;

    end[0].el.style.padding = endProp.r + 'px';

    endProp.range = convert(end.range);
    // ball.margin = ball.margin / 100;

    let mapEl = mapContainer.querySelector('.map');
    mapEl.innerHTML = screenContainer.innerHTML;
    mapEl.querySelector('canvas').remove();
    mapEl.querySelector('.score-container').remove();
    mapEl.querySelectorAll('path')[0].setAttribute('d', '');
    mapEl.querySelectorAll('path')[1].setAttribute('d', '');

    let playerDesign = document.createElement('div');
    playerDesign.className = 'player-design';
    playerDesign.style.width = playerSize.width + 28 + 'px';
    playerDesign.style.height = playerSize.width + 28 + 'px';

    let playerImage = frogImage.cloneNode(true);
    playerImage.style.width = playerSize.width + 'px';
    playerImage.style.height = playerSize.height + 'px';

    mapEl.appendChild(playerDesign);
    playerDesign.appendChild(playerImage);

    mapPath = mapContainer.querySelector('path');
    mapEnd = mapContainer.querySelector('.end');
}

function gameInitialization(paths) {
    updatePath(paths, screenContainer.querySelector('path'), end[0].el);
    pathLength = path.getTotalLength();

    ball.speed = convert(ball.speed);
    ball.startSpeed = convert(ball.startSpeed);
    ball.reverseSpeed = convert(ball.reverseSpeed);
    ball.gameOverSpeed = convert(ball.gameOverSpeed);
    lightTrail.speed = convert(lightTrail.speed);
    lightTrail.margin = convert(lightTrail.margin);
    fastPhaseTime = fastPhaseTime * pathLength / 100 / ball.startSpeed / pathLength * 18.688033854166665;

    mainContainer.appendChild(screenContainer.cloneNode(true));
    canvas = document.querySelectorAll('canvas');

    end[1].el = document.querySelectorAll('.end')[1];

    context[0] = canvas[0].getContext('2d');
    context[1] = canvas[1].getContext('2d');

    checkSpace();
}

function starting() {
    sound('title', 'music');

    generateLightTrail();
    sound('light-trail');

    lightTrail.interval = setInterval(() => {
        clearScreen();

        updatePlayers();

        if (lightTrails[0].length && lightTrails[1].length && !gameStart) {
            updateLightTrail();

            if (!lightTrails[0].length && lightTrails[1].length) {
                sound('start');
            }
        } else {
            start();
        }
    }, 20);
}

function start() {
    clearInterval(lightTrail.interval);

    toneSound.lightTrail.tone.disconnect();

    gameStart = true;

    setTimeout(() => {
        sound('rolling');

        animate();

        // setTimeout(() => { // DEBUG
        //     turnColor();
        // }, 1000);
    }, 500);
}

function animate() {
    if (render) {
        generateBall();

        gameInterval = setInterval(() => {
            milliseconds += 20;

            startingPhase = milliseconds < fastPhaseTime && !resetTimer;

            update();
            check();

            if (!gameOver && balls[playerIndex][balls[playerIndex].length - 1].percent > (startingPhase ? ball.startMargin : ball.margin)) {
                generateBall();
            }

            if (gameOver) {
                generateGameOverParticles();
            }

            if (!render) {
                update();
                clearInterval(gameInterval);
            }
        }, 20);
    }
}

function restart() {
    location.reload();
}

function assignPlayer(playerList, playerPosition) {
    for (const id in playerList) {
        let index = Object.keys(playerList).indexOf(id);

        players[index] = new Player(index, playerList[id], playerPosition.x, playerPosition.y);

        if (socket.id === id) {
            player = players[index];
            playerIndex = index;

            setTimeout(() => {
                player.loadBall();
            }, 300);
        }
    }
}

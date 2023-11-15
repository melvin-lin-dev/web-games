let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let cvs = {};

let screenContainer = document.querySelector('.screen-container');
let mainContainer = document.querySelector('.main-container');
let gameOverContainer = document.querySelector('.game-over-container');
let nameEl = document.querySelector('.information-container .name');
let scoreEl = document.querySelector('.information-container .score');

let svg = document.querySelector('svg');
// svg.setAttribute('width', canvas.width = screen.width / 2);
// svg.setAttribute('height', canvas.height = screen.height);
svg.setAttribute('width', canvas.width = cvs.width = window.innerWidth);
svg.setAttribute('height', canvas.height = cvs.height = window.innerHeight);
let path = document.querySelector('path');
let pathLength;

let player;
let frogImage = new Image();
frogImage.src = 'assets/images/frog.png';

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

let shootBalls = [], balls = [], particles = [], scores = [], lightTrails = [], scoreMultiplier = [];

let endProp = {
    r: 50,
    range: 20,
    value: 100
};

let end = {
    el: document.querySelector('.end'),
    milliseconds: 0
};
let scale = 5000;

let milliseconds = 0;

let lightTrail = {
    quantity: 10,
    r: 6.5,
    speed: 15,
    margin: ball.startSpeed * 0.2,
    color: 'yellow',
    sound: new Tone.Buffer(`assets/sounds/effect/lighttrail2.ogg`),
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

let reverseBallIndexes = [];

let savedLocation = {};

let breakSound = new Tone.Buffer(`assets/sounds/effect/chime1.ogg`);
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

let currentMap = null;

function saveData(key, data){
    let curData = JSON.parse(localStorage.zuma);
    curData[key] = data;
    localStorage.zuma = JSON.stringify(curData);
}

function loadData(key){
    let curData = JSON.parse(localStorage.zuma);
    return curData[key];
}

function initialization() {
    let sizeScale = 0.55;
    playerSize.width = frogImage.width * sizeScale;
    playerSize.height = frogImage.height * sizeScale;

    path.style.strokeWidth = ball.r * 2;

    let clonePath = path.cloneNode(true);
    svg.insertBefore(clonePath, path);
    clonePath.style.strokeWidth = +clonePath.style.strokeWidth + 12;

    end.el.style.padding = endProp.r + 'px';

    // endProp.range = convert(end.range);
    // ball.margin = ball.margin / 100;

    let mapEl = mapContainer.querySelector('.map');
    mapEl.innerHTML = screenContainer.innerHTML;
    mapEl.querySelector('canvas').remove();
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
    updatePath(paths, screenContainer.querySelector('path'), end.el);
    pathLength = path.getTotalLength();

    ball.speed = convert(ball.speed);
    ball.startSpeed = convert(ball.startSpeed);
    ball.reverseSpeed = convert(ball.reverseSpeed);
    ball.gameOverSpeed = convert(ball.gameOverSpeed);
    lightTrail.speed = convert(lightTrail.speed);
    lightTrail.margin = convert(lightTrail.margin);
    fastPhaseTime = fastPhaseTime * pathLength / 100 / ball.startSpeed / pathLength * 18.688033854166665;

    checkSpace();
}

function starting() {
    sound('title', 'music');

    generateLightTrail();
    sound('light-trail');

    lightTrail.interval = setInterval(() => {
        clearScreen();

        player.draw();

        if (lightTrails.length && !gameStart) {
            updateLightTrail();

            if (!lightTrails.length) {
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

            if (!gameOver && balls[balls.length - 1].percent > (startingPhase ? ball.startMargin : ball.margin)) {
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

function playAgain(){
    player = null;
    
    ball = {
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
    fastPhaseTime = 41;
    startingPhase = true;
    resetTimer = false;
    
    shootBalls = [];
    balls = [];
    particles = [];
    scores = [];
    lightTrails = [];
    scoreMultiplier = [];
    
    endProp = {
        r: 50,
        range: 20,
        value: 100
    };
    
    [...end.el.children].forEach(mouth => {
        mouth.style.margin = 0;
    });
    end.milliseconds = 0;
    scale = 5000;
    
    milliseconds = 0;
    
    lightTrail = {
        quantity: 10,
        r: 6.5,
        speed: 15,
        margin: ball.startSpeed * 0.2,
        color: 'yellow',
        sound: new Tone.Buffer(`assets/sounds/effect/lighttrail2.ogg`),
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
    
    gameOver = null;
    gameStart = false;
    render = true;
    gameInterval = undefined;
    
    reverseBallIndexes = [];
    
    savedLocation = {};

    currentMap = null;

    gameOverContainer.classList.remove('active');
    showLobbyLayout();

    document.querySelector(`.lobby-container .player-name`).value = '';
    document.getElementById('btn-start').disabled = true;

    mainContainer.classList.remove('active');
}

function assignPlayer() {
    const playerName = document.querySelector('.player-name').value;
    player = new Player(playerName, currentMap.player.x, currentMap.player.y);

    setTimeout(() => {
        player.loadBall();
    }, 300);
}

function startGame(){
    document.querySelector('.lobby-container').classList.remove('active');

    const informationContainerEl = document.querySelector('.information-container');
    informationContainerEl.querySelector('.name').innerHTML = '';
    informationContainerEl.querySelector('.score').innerHTML = 0;

    gameInitialization(currentMap.paths);
    assignPlayer();

    setTimeout(() => {
        document.querySelector('.countdown-container').classList.add('active');

        setTimeout(() => {
            document.querySelector('.countdown-container').classList.remove('active');

            setTimeout(() => {
                mainContainer.classList.add('active');

                setTimeout(() => {
                    starting();
                });
            }, 500);
        }, 4000);
    }, 400);
}

function showRanking(show = true){
    const rankContainerEl = document.querySelector('.rank-container');

    if(show){
        const tbodyEl = rankContainerEl.querySelector('tbody');
        tbodyEl.innerHTML = '';

        const ranks = loadData('ranks').sort((a, b) => b.score - a.score).slice(0, 10);
        ranks.forEach((rank, index) => {
            const tr = document.createElement('tr');

            const tdRank = document.createElement('td');
            tdRank.innerHTML = ++index;

            const tdName = document.createElement('td');
            tdName.innerHTML = rank.name;

            const tdScore = document.createElement('td');
            tdScore.innerHTML = rank.score;

            tr.appendChild(tdRank);
            tr.appendChild(tdName);
            tr.appendChild(tdScore);

            tbodyEl.appendChild(tr);
        });

        rankContainerEl.classList.add('active');
    }else{
        rankContainerEl.classList.remove('active');
    }
}
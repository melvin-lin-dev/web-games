let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 8;
let size = cvs.width / length;

let gameGrid = [];
let gameOver = false;

let turn = 'black';
let player = {name: '', color: ''};

let dirs = [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]];

let checking = {status: false, valid: false};

let instructionEl = document.querySelector('.instruction');

let score = {white: 0, black: 0};

let audio = new Audio('music/background.mp3');
audio.loop = true;
audio.play();

window.onload = () => { // Draw the objects
    generateGrid();
    drawObjects();
    drawLines();

    toggleInstruction('show');

    let highScore = localStorage.highScore ? JSON.parse(localStorage.highScore) : '';
    document.getElementById('high-score-name').innerHTML = highScore ? highScore.name : '-';
    document.getElementById('high-score').innerHTML = highScore ? highScore.score : '-';
};

function start() { // Start the game
    generateGrid();
    changeTurn();
    checkValidMove();
    update();
}

function update() { // Update the game
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawLines();
    drawObjects();
    requestAnimationFrame(update);

    if (gameOver) {
        let winner = score.white === score.black ? '' : score.white > score.black ? 'White' : 'Black';

        let currentHighScore = score[player.color];

        if (currentHighScore > localStorage.highScore || !localStorage.highScore) {
            localStorage.highScore = JSON.stringify({name: player.name, score: currentHighScore});
        }

        document.querySelector('.gameover').style.transform = 'translate(-50%,-50%) scale(1)';
        document.querySelector('.gameover h2').innerHTML = winner ? `${winner} Won` : 'DRAW';
    }
}

function checkInput(event) { // Validate the input whether it's empty or not
    if (event.target.value.length) {
        toggleButtonDisabled('remove');
    } else {
        toggleButtonDisabled('add');
    }
}

function toggleButtonDisabled(command) { // Toggle button disable
    let buttons = document.querySelectorAll('.form button');

    buttons.forEach(button => {
        button.classList[command]('disabled');
        button.disabled = command === 'add';
    });
}

function toggleInstruction(command) { // Toggle show instruction
    if (command === 'hide') {
        instructionEl.style.transform = 'translate(-50%,-50%) scale(0)';
    } else {
        instructionEl.style.transform = 'translate(0,0) scale(1)';
    }
}

function chooseColor(color) { // Player chosen color function
    player.name = document.querySelector('.form input').value;
    player.color = color;

    let enemy = color === 'white' ? 'black' : 'white';

    document.getElementById(`${color}-controller`).innerHTML = 'player';
    document.getElementById(`${enemy}-controller`).innerHTML = 'computer';

    toggleInstruction('hide');

    let countdown = 3;
    countDown(countdown);
    let countdownInterval = setInterval(() => {
        countdown--;
        countDown(countdown);

        if (!countdown) {
            clearInterval(countdownInterval);
            start();
        }
    }, 1000);
}

function countDown(countdown) { // Game count down
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.save();
    ctx.beginPath();
    ctx.font = '100px cooper black';
    ctx.fontStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(countdown, cvs.width / 2, cvs.height / 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function toggleMute(){ // Toggle music mute
    let muteEl = document.querySelector('.sound-icon .mute');

    if(muteEl.style.height === '135%'){
        muteEl.style.height = '0';
    }else{
        muteEl.style.height = '135%';
    }

    audio.muted = !audio.muted;
}
let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 9;
let size = cvs.width / length;
let gameGrid = [
    // [7, 3, 5, 6, 1, 4, 8, 9, 2],
    // [8, 4, 2, 9, 7, 3, 5, 6, 1],
    // [9, 6, 1, 2, 8, 5, 3, 7, 4],
    // [2, 8, 6, 3, 4, 9, 1, 5, 7],
    // [4, 1, 3, 8, 5, 7, 9, 2, 6],
    // [5, 7, 9, 1, 2, 6, 4, 3, 8],
    // [1, 5, 7, 4, 9, 2, 6, 8, 3],
    // [6, 9, 4, 7, 3, 8, 2, 1, 5],
    // [3, 2, 8, 5, 6, 1, 7, 4, 9]
];

let gameOver = false;

let second = 0, minute = 0, hour = 0;
let time;

window.onload = () => {
    start();
};

function start() {
    drawBoard();
    // generateNumber();

    let time = setInterval(()=>{
        if(!gameOver){
            if(second < 60) second++;
            else {
                second = 1;
                minute++;
            }

            if(minute == 60) {
                minute = 0;
                hour++;
            }

            document.querySelector('h2').innerHTML = `${hour} : ${minute} : ${second}`;
        }else{
            clearInterval(time);
        }
    }, 1000);

    update();
}

function update() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    if (!gameOver) {
        drawLine();
        drawLineGroup();
        drawText();
        validation();

        requestAnimationFrame(update);
    } else {
        ctx.save();
        ctx.font = '50px segoe ui';
        ctx.fillText('You Won', cvs.width / 2, cvs.height / 2);
        ctx.restore();

        document.querySelector('h2').style.top = window.innerHeight / 2 + 40 + 'px';
    }
}
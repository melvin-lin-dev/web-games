let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 4;
let size = cvs.width/length;

let gameGrid = [];

let checkGenerate = 0;

let gameOver = false;

let winScore = 512;

window.onload = () => {
    start();
};

function start(){
    generateGrid();
    generateRandomBlock();

    update();
}

function update(){
    ctx.clearRect(0,0,cvs.width,cvs.height);

    if(!gameOver){
        drawBoard();
        drawLine();

        checkGameover();

        requestAnimationFrame(update);
    }else{
        ctx.beginPath();
        ctx.save();

        let width = 300;
        let height = 150;

        ctx.fillStyle = 'white';
        ctx.fillRect(cvs.width/2-width/2,cvs.height/2-height/2,width,height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText('You Reached 512',cvs.width/2,cvs.height/2);

        ctx.restore();
        ctx.closePath();
    }
}

function random(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
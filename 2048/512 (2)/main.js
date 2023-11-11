let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let gameOver = false;

let length = 4;
let size = cvs.width / length;

window.onload = () => {
    start();
}

function start(){
    generateBlock();

    update();
}

function update(){
    requestAnimationFrame(update);
}
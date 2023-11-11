let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 8;
let size = cvs.width / length;
let gameGrid = [];
let gameOver = false;

let source = '';

let flows = [];
let dir = [[0,-1],[1,0],[0,1],[-1,0]];

window.onload = () => {
	start();
}

function start(){
	generateGrid();
	generatePipe();
	resetState();
	update();
}

function update(){
	if(!gameOver){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		drawObject();

		requestAnimationFrame(update);
	}
}

function rand(min, max){
	return Math.floor(Math.random() * (max + 1)) + min;
}
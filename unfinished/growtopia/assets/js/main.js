let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let blockSize = 60;
let game = {width: 100, height: 60};
let board = {width: blockSize * game.width, height: blockSize * game.height};

let player;
let gameBoard = [];
let hitBlocks = [];

window.onload = () => {
	player = new Player;
	
	start();
}

function start(){
	generateGrids();
	generateBlocks();

	update();
}

function update(){
	ctx.clearRect(0,0,cvs.width,cvs.height);

	drawBoard();
	updateObjects();
	player.draw();
	drawHit();

	moving();

	checkPhysic();

	requestAnimationFrame(update);
}

function updateObjects(){
	for(let row = 0; row < game.height; row++){
		for(let col = 0; col < game.width; col++){
			let block = gameBoard[row][col];

			if(block.x >= player.view.x && 
				block.y >= player.view.y &&
				block.x + blockSize <= player.view.x + player.view.radiusX &&
				block.y + blockSize <= player.view.y + player.view.radiusY &&
				block.hp
			){
				block.update();
				block.draw();
			}
		}
	}
}
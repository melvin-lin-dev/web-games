let cvs = document.getElementById('chess-board');
let ctx = cvs.getContext('2d');

let tileLength = 8;
let tileSize = cvs.width / tileLength;

let gameBoard = [];
let pawns = [];
let pawnsSelect = [];

let turn = 'white';
	
let pawnSelectList = ['queen','rook','horse','bishop'];

window.onload = () => {
	start();
};

function start(){
	generateBoard();
	generatePawnSelectList();

	refreshBoard();
	drawPawn();

	checkKingMoves(true);

	update();
}

function update(){
    ctx.clearRect(0, 0, cvs.width, cvs.height);

	updateObject();
	
	requestAnimationFrame(update);
}

function updateObject(){
	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			gameBoard[y][x].draw();
			if(pawns[y][x]) {
			    pawns[y][x].draw();
            }
		}
	}

	pawnsSelect.forEach((pawnSelect)=>{
		pawnSelect.draw();
	})
}

function checkGameOver(){
	let gameOver = false;

	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){

		}
	}
}

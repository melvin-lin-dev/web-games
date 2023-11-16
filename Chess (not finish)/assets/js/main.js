let cvs = document.getElementById('chess-board');
let ctx = cvs.getContext('2d');

let tileLength = 8;
let tileSize = cvs.width / tileLength;

let gameBoard = [];
let pawns = [];
let pawnsSelect = [];

let turn = 'white';
	
let pawnSelectList = ['queen','rook','horse','bishop'];

let checkMate = null;

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
	if(!checkMate){
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		updateObject();

		requestAnimationFrame(update);
	}else{
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		updateObject();

		const gameOverContainerEl = document.querySelector('.game-over-container');

		gameOverContainerEl.querySelector('#winner').innerHTML = turn === 'white' ? 'black' : 'white';

		gameOverContainerEl.classList.add('active');
	}
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

function isCheckMate(){
	let kingMoves = 0;
	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			const pawn = pawns[y][x];
			if(pawn && pawn.color === turn && pawn.type === 'king') {
				checkMove(pawn);
            }
		}
	}

	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			const tile = gameBoard[y][x];
			if (tile.dot) {
				tile.dot = false;
				kingMoves++;
			}
		}
	}

	let otherMoves = 0;
	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			const pawn = pawns[y][x];
			if(pawn && pawn.color === turn && pawn.type !== 'king') {
				checkMove(pawn);
            }
		}
	}

	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			const tile = gameBoard[y][x];
			if (tile.dot || tile.eatable) {
				tile.dot = false;
				tile.eatable = false;
				otherMoves++;
			}
		}
	}

	let kingChecks = isKingCheck();

	// console.log('debug', (kingChecks > 1 && !kingMoves), (kingChecks === 1 && !otherMoves), kingMoves, otherMoves, kingChecks);

	if((kingChecks > 1 && !kingMoves) || (kingChecks === 1 && !otherMoves)){
		checkMate = turn;
	}
}

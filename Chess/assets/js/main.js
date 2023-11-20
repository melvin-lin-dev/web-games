let cvs = document.getElementById('chess-board');
let ctx = cvs.getContext('2d');

let tileLength = 8;
let tileSize = cvs.width / tileLength;

let gameBoard = [];
let pawns = [];
let pawnsSelect = [];

let turn = 'white';
	
let pawnSelectList = ['queen','rook','horse','bishop'];

let gameOver = null;

let consecutiveMoves = 0;

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
	if(!gameOver){
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		updateObject();

		requestAnimationFrame(update);
	}else{
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		updateObject();

		const gameOverContainerEl = document.querySelector('.game-over-container');
		const h1El = gameOverContainerEl.querySelector('h1');
		const winnerEl = gameOverContainerEl.querySelector('#winner');

		if (gameOver === 'Checkmate') {
			h1El.innerHTML = gameOver + ' ' + turn;
			winnerEl.innerHTML = turn === 'white' ? 'black' : 'white';
		} else {
			h1El.innerHTML = gameOver;
			winnerEl.parentNode.style.display = 'none';
		}

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

	console.log('checkmate', (kingChecks > 1 && !kingMoves), (kingChecks === 1 && !otherMoves), kingMoves, otherMoves, kingChecks);

	if((kingChecks > 1 && !kingMoves) || (kingChecks === 1 && !(kingMoves || otherMoves))){
		gameOver = 'Checkmate';
	}else if(kingChecks === 0 && kingMoves === 0 && otherMoves === 0){
		gameOver = 'Stalemate';
	}else{
		isDraw();
	}
}

function isDraw(){
	const IS_FIFTY_MOVE_RULE = consecutiveMoves / 2 === 50;

	const PIECES = {};
	let piecesLeft = 0;
	for(let y = 0; y < tileLength; y++){
		for(let x = 0; x < tileLength; x++){
			const pawn = pawns[y][x];
			if(pawn){
				piecesLeft++;
				if(PIECES[pawn.type]){
					PIECES[pawn.type]++;
				}else{
					PIECES[pawn.type] = 1;
				}
			}
		}
	}

	const DRAW_PIECES = piecesLeft === 3 && (PIECES[3] === 1 || PIECES[4] === 1);
	
	if (IS_FIFTY_MOVE_RULE) {
		gameOver = 'Draw by Fifty-Move Rule';
	}

	if(DRAW_PIECES){
		gameOver = 'Draw'
	}
}
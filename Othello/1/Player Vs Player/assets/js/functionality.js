function cvsClick(e){
	let x = e.offsetX;
	let y = e.offsetY;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			let tileX = col * size;
			let tileY = row * size;
			let tile = gameGrid[row][col];

			if(x > tileX && y > tileY && x <= tileX + size && y <= tileY + size && !tile){
				let enemy = turn == 'white' ? 'black' : 'white';

				checkMove(row, col, enemy);
			}
		}
	}
}

function checkMove(y,x,enemy){
	let tileCollected = [];

	directions.forEach((dir, index) => {
		let nextX = x + dir[0];
		let nextY = y + dir[1];

		let tileCollect = [];

		while(true){
			if(checkOutbound(nextX,nextY)){
				let currentTile = gameGrid[nextY][nextX];

				if(currentTile == enemy){
					tileCollect.push({x: nextX, y: nextY});
				}else if(currentTile == turn){
					tileCollected = [...tileCollected, ...tileCollect];
					break;
				}else{
					tileCollect = [];
					break;
				}
			}else{
				break;
			}

			nextX += dir[0];
			nextY += dir[1];
		}
	})

	if(tileCollected.length){
		tileCollected.push({x,y});
		collectTile(tileCollected);
	}

}

function collectTile(tileCollected){
	if(tileCollected.length){
		tileCollected.forEach(tile => {
			gameGrid[tile.y][tile.x] = turn;
		});

		turn = turn == 'white' ? 'black' : 'white';

		updateBoard();
		checkEmptyTile();
	}
}

function checkOutbound(x,y){
	return x >= 0 && y >= 0 && x < length && y < length
}

function updateBoard(){
	score = {black: 0, white: 0};

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			score[gameGrid[row][col]]++;
		}
	}

	document.getElementById('black-score').innerHTML = score.black;
	document.getElementById('white-score').innerHTML = score.white;

	document.getElementById('turn').style.backgroundColor = turn;
}

function checkEmptyTile(){
	let empty = false;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			if(!gameGrid[row][col]) empty = true;
		}
	}

	if(!empty) gameOver = true;
}
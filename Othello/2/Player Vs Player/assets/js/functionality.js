function cvsClick(event){
	let x = event.offsetX;
	let y = event.offsetY;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			let tile = gameGrid[row][col];

			if(x > tile.x && y > tile.y && x < tile.x + size && y < tile.y + size && !tile.color){
				checkSurroundings(col, row, turn === 'black' ? 'white' : 'black');
			}
		}
	}
}

function checkSurroundings(x,y,enemy){
	let tile = gameGrid[y][x];
	let saveTile = [];

	directions.forEach(direction => {
		let saveTemporaryTile = [];
		
		let next = {x,y};

		while(true){
			next.x += direction[0];
			next.y += direction[1];

			if(checkOutOfBound(next.x,next.y)){
				let nextTile = gameGrid[next.y][next.x];

				if(nextTile.color){
					if(nextTile.color === enemy){
						saveTemporaryTile.push(nextTile);
					}else{
						saveTile.push(...saveTemporaryTile);
						break;
					}
				}else{
					break;
				}
			}else{
				break;
			}
		}
	})

	if(saveTile.length){
		saveTile.push(tile);
		changeEnemyColor(saveTile, enemy);
	}
}

function changeEnemyColor(saveTile, enemy){
	saveTile.forEach(tile => {
		tile.color = turn;
	});

	turn = enemy;
}

function checkEmpty(){
	let empty = false;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			if(!gameGrid[row][col].color){
				empty = true;
			}
		}
	}

	if(!empty){
		gameOver = true;
	}
}

function countScore(){
	score.white = 0;
	score.black = 0;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			score[gameGrid[row][col].color]++;
		}
	}
}
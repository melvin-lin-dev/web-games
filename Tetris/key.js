let down = false;
window.onkeydown = function(e){
	let key = e.keyCode;
	let lastBlock = blocks[blocks.length-1];
	switch(key){
		case 37:
			moveHorizontal(key,lastBlock);
			break;
		case 39:
			moveHorizontal(key,lastBlock);
			break;
		case 38:
			lastBlock.rotate();
			break;
		case 40:
			down = true;
			break;
		case 32:
			reset();
			break;
	}
}

window.onkeyup = function(e){
	let key = e.keyCode;
	if(key == 40){ down = false;}
}

function key(){
	if(down){
		timeLimit = 2;
	}else{
		timeLimit = 40;
	}
}

function moveHorizontal(key,lastBlock){
	let move = key - 38;
	let pass = true;
	for(let i = 0; i < lastBlock.grid; i++){
		for(let x = 0; x < lastBlock.grid; x++){
			if(lastBlock.shape[i][x] == 1){
				let gameX = lastBlock.x+x+move;
				let gameY = lastBlock.y+i;
				if(gameX < 0 || gameX > game_grid[0].length-1){
					pass = false;
					return false;
				}

				if(game_grid[gameY][gameX] == 1){
					pass = false;
				}
			}
		}
	}

	if(pass){
		lastBlock.x+=move;
	}
}
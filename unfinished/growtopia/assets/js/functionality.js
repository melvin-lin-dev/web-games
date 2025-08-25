function select(e){
	let mouse = {
		x: e.offsetX,
		y: e.offsetY
	};

	for(let row = 0; row < game.height; row++){
		for(let col = 0; col < game.width; col++){
			let block = gameBoard[row][col];

			if(mouse.x >= block.x && mouse.y >= block.y && mouse.x < block.x + blockSize && mouse.y < block.y + blockSize){
				hitBlocks.push({row, col, time: 0, timeLimit: 20});

				if(block.hp){
					block.hp--;
				}
			}
		}
	}
}

function checkOutOfBound(x,y,w,h){
	return x >= 0 && y >= 0 && x + w < board.width && y + h < board.height;
}
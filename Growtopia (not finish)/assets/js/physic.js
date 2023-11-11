function checkPhysic(){
	let nextBlockY = player.y + blockSize;
	if(checkOutOfBound(player.x, nextBlockY, player.w, player.h)){
		for(let row = 0; row < game.height; row++){
			for(let col = 0; col < game.width; col++){
				let block = gameBoard[row][col];

				if(player.x >= block.x && 
					player.x + player.w < block.x + blockSize &&
					block.y == nextBlockY &&
					!block.hp
				){
					if(block.y == block.targetY){
						moveBlocks();
					}
				}
			}
		}
		// if(!gameBoard[nextBlockY / blockSize][player.x / blockSize].hp){
		// 	console.log(player.x / blockSize);
		// 	// console.log(gameBoard[nextBlockY / blockSize][player.x / blockSize].x, gameBoard[nextBlockY / blockSize][player.x / blockSize].y);
		// 	moveBlocks();
		// }
	}
	// for(let row = 0; row < game.height; row++){
	// 	for(let col = 0; col < game.width; col++){
	// 		let block = gameBoard[row][col];
	// 		let blockMove = false;

	// 		if(checkOutOfBound(col * blockSize, (row - 1) * blockSize, blockSize, blockSize)){
	// 			// if(!gameBoard[row + 1][col].hp) alert('a');
	// 			if(player.x >= block.x && 
	// 				player.x + player.w < block.x + blockSize && 
	// 				player.y + player.h <= block.y && 
	// 				// player.y >= gameBoard[row - 1][col]. && 
	// 				!block.hp
	// 			){
	// 				moveBlocks();
	// 			}
	// 		}
	// 	}
	// }
}

function moveBlocks(){
	for(let row = 0; row < game.height; row++){
		for(let col = 0; col < game.width; col++){
			let block = gameBoard[row][col];
			block.targetY = block.y - blockSize;
		}
	}
}
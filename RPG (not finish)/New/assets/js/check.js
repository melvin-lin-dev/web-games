function checkCollision(dir, value){
	for(let i = 0; i < blockLength; i++){
		for(let j = 0; j < blockLength; j++){
			let block = blocks[i][j];

			let checkPlayer = {
				left: player.x + player.r * 3,
				right: player.x + 4,
				top: player.y + player.r * 3,
				bottom: player.y + 4
			};

			checkPlayer[dir] += value;

			let checkLeft = checkPlayer.left >= block.x;
			let checkRight = checkPlayer.right < block.x + blockSize;
			let checkTop = checkPlayer.top >= block.y;
			let checkBottom = checkPlayer.bottom < block.y + blockSize;

			if(!block.pass && checkLeft && checkRight && checkTop && checkBottom){
				return true;
			}
		}
	}
}
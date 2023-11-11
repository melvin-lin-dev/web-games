let bedrockHeight = 6;
let dirtHeight = 30;

function generateGrids(){
	for(let row = 0; row < game.height; row++){
		gameBoard.push([]);
		for(let col = 0; col < game.width; col++){
			let usedHeight = dirtHeight + bedrockHeight;
			let blockX = (col - dirtHeight + bedrockHeight + player.x / blockSize + 1) * blockSize;
			let blockY = (row - dirtHeight + bedrockHeight + player.y / blockSize + 1) * blockSize;
			let blockTexture = '';
			gameBoard[row].push(new Block(blockX, blockY,blockTexture));
		}
	}
}

function generateBlocks(){
	generateDirts();
	generateBedRocks();
}

function generateDirts(){
	let startY = game.height - dirtHeight - bedrockHeight;

	for(let row = 0; row < dirtHeight; row++){
		for(let col = 0; col < game.width;col++){
			let blockX = col;
			let blockY = startY + row;
			let blockTexture = 'dirt';
			gameBoard[blockY][blockX].setBlock(blockTexture);
		}
	}
}

function generateBedRocks(){
	let startY = game.height - bedrockHeight;

	for(let row = 0; row < bedrockHeight; row++){
		for(let col = 0; col < game.width; col++){
			let blockX = col;
			let blockY = startY + row;
			let blockTexture = 'bedrock';
			gameBoard[blockY][blockX].setBlock(blockTexture);
		}
	}
}
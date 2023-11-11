function updateObject(){
	for(let i = 0; i < blockLength; i++){
		for(let j = 0; j < blockLength; j++){
			blocks[i][j].draw();
		}
	}

	drawPlayer();
}
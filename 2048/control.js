window.onkeyup = function(e){
	let key = e.keyCode;
	let generate = false;
	switch(key){
		case 37:
			for(let i = 0; i < size; i++){
				for(let j = 0; j < size; j++){
					let game_grid = gameGrid[i][j];
					if(game_grid != 0){
						for(let col = 0; col < j; col++){
							let moveGrid = gameGrid[i][col];
							if((moveGrid == game_grid || moveGrid == 0)){
								if(moveGrid == game_grid){
									game_grid *= 2;
									score += game_grid;
								}
								gameGrid[i][col] = game_grid;
								gameGrid[i][j] = 0;
								generate = true;
								break;
							}
						}
					}
				}
			}
			break;
		case 38:
			for(let i = 0; i < size; i++){
				for(let j = 0; j < size; j++){
					let game_grid = gameGrid[i][j];
					for(let row = 0; row < i; row++){
						let moveGrid = gameGrid[row][j];
						if(moveGrid == game_grid || moveGrid == 0){
							if(moveGrid == game_grid){
								game_grid *= 2;
								score += game_grid;
							}
							gameGrid[row][j] = game_grid;
							gameGrid[i][j] = 0;
							generate = true;
							break;
						}
					}
				}
			}
			break;
		case 39:
			for(let i = size - 1; i >= 0; i--){
				for(let j = size - 1; j >= 0; j--){
					let game_grid = gameGrid[i][j];
					for(let col = size - 1; col > j; col--){
						let moveGrid = gameGrid[i][col];
						if(moveGrid == game_grid || moveGrid == 0){
							if(moveGrid == game_grid){
								game_grid *= 2;
								score += game_grid;
							}
							gameGrid[i][col] = game_grid;
							gameGrid[i][j] = 0;
							generate = true;
							break;
						}
					}
				}
			}
			break;
		case 40:
			for(let i = size - 1; i >= 0; i--){
				for(let j = size -1; j >= 0; j--){
					let game_grid = gameGrid[i][j];
					for(let row = size - 1; row > i; row--){
						let moveGrid = gameGrid[row][j];
						if(moveGrid == game_grid || moveGrid == 0){
							if(moveGrid == game_grid){
								game_grid *= 2;
								score += game_grid;
							}
							if(moveGrid == game_grid) game_grid *= 2;
							gameGrid[row][j] = game_grid;
							gameGrid[i][j] = 0;
							generate = true;
							break;
						}
					}
				}
			}
			break;
		case 32:
			if(gameOver) reset();
			break;
	}
	if((key == 37 || key == 38 || key == 39 || key == 40) && generate) generateBlock();
}
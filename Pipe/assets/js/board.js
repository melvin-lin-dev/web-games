let stock = [8, 10, 16, 28];

let sourceDestination = [0,1];

function generatePipe(){
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			let tileX = col * size;
			let tileY = row * size;
			let tileType = rand(0, stock.length - 1);

			while(true){
				tileType = rand(0, stock.length - 1);

				if(Math.random() < 0.3 && sourceDestination.length && col > 1 && row > 1 && col < length - 1 && row < length - 1){
					let pass = true;
					for(let y = 0; y < 5; y++){
						for(let x = 0; x < 5; x++){
							let checkX = col + x - 2;
							let checkY = row + y - 2;

							if(checkOutOfBound(checkX, checkY)){
								if(gameGrid[checkY][checkX].imageType === 'source_and_destination'){
									pass = false;
								}
							}
						}
					}

					if(pass){
						let randType = rand(0,sourceDestination.length - 1);
						let type = sourceDestination[randType];
						sourceDestination.splice(randType, 1);

						if(!type){ // Type == 0
							source = {x: col, y: row};
						}

						gameGrid[row][col] = new Tile('source_and_destination', tileX, tileY, type, rand(0, 3));
						break;
					}
				}

				if(stock[tileType]){
					gameGrid[row][col] = new Tile('pipe', tileX, tileY, tileType, rand(0, 3));
					stock[tileType]--; // Untuk kurangi stock
					break;
				}
			}
		}
	}
}

function drawObject(){
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			gameGrid[row][col].update();
			gameGrid[row][col].draw();
		}
	}
}
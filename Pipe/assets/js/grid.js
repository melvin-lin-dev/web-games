function generateGrid(){
	for(let row = 0; row < length; row++){
		gameGrid.push([]);
		for(let col = 0; col < length; col++){
			gameGrid[row].push('');
		}
	}
}
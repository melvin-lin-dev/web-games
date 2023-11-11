function getPosition(e){
	let cvsRect = cvs.getBoundingClientRect();

	let x = e.pageX - cvsRect.left;
	let y = e.pageY - cvsRect.top;

	for(let key in cell){
		let theCell = cell[key];
		if(x >= theCell.x && y >= theCell.y && x <= theCell.x+cellSize && y <= theCell.y+cellSize){
			if(e.which == 3){
				if(theCell.flag) theCell.flag = false;
				else theCell.flag = true;
				e.preventDefault();
				return false;
			}
			if(theCell.flag) return false;

			if(theCell.type == 'bee'){
				gameOver = true;
				return false;
			}

			if(theCell.reveal) return;

			theCell.reveal = true;

			if(theCell.value == 0){
				flow(theCell.x/cellSize,theCell.y/cellSize)
			}
		}
	}
}
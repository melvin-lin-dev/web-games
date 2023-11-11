function drawGrid(){
	for(let i = 0; i <= size; i++){
		ctx.moveTo(0,i*cellSize);
		ctx.lineTo(cvs.height,i*cellSize);
		for(let j = 0; j <= size; j++){
			ctx.moveTo(j*cellSize,0);
			ctx.lineTo(j*cellSize,cvs.width);
		}
	}
	ctx.strokeStyle = 'grey';
	ctx.stroke();
}
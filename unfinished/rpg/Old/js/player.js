let player = {
	x: 9 * blockSize,
	y: 9 * blockSize,
	r: 5,
	texture: 'red',
	// facing: 'bottom',
};

function drawPlayer(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = player.texture;
	ctx.arc(player.x + blockSize / 2, player.y + blockSize / 2, player.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}
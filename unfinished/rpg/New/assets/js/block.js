class Block{
	constructor(x,y,texture){
		this.x = x * blockSize;
		this.y = y * blockSize;
		this.texture = texture;

		this.pass = true;
	}

	draw(){
		let image = new Image();
		image.src = `assets/texture/${this.texture}`;
		ctx.drawImage(image, this.x, this.y, blockSize, blockSize);

		// ------- Fill Rect --------
		// ctx.save();
		// ctx.beginPath();
		// ctx.fillStyle = this.texture;
		// ctx.fillRect(this.x,this.y,blockSize,blockSize);
		// ctx.closePath();
		// ctx.restore();
	}
}
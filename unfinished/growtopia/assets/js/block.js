let blockTypes = {
	dirt: {
		hp: 3,
		texture: 'dirt.png'
	},
	bedrock: {
		hp: '~',
		texture: 'bedrock.png'
	}
};

class Block{
	constructor(x,y,texture){
		this.x = x;
		this.y = y;

		this.targetY = y;
	}

	update(){
			// console.log(this.y, this.targetY);
		if(this.y > this.targetY){
			this.y--;
		}
	}

	setBlock(texture){
		let block = blockTypes[texture]
		this.hp = block.hp;
		this.texture = block.texture;
	}
	
	draw(){
		let blockImage = new Image();
		blockImage.src = `assets/images/textures/${this.texture}`;

		ctx.save();
		ctx.drawImage(blockImage, this.x, this.y, blockSize, blockSize);
		ctx.restore();
	}
}
class Tile{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.color = '';
	}

	draw(){
		if(this.color){
			ctx.beginPath();
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.arc(this.x + size/2,this.y+size/2,size /2 - 10,0,2*Math.PI);
			ctx.fill();
			ctx.restore();
			ctx.closePath();
		}
	}
}
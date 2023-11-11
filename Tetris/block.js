class Block{
	constructor(x,y,size){
		this.x = x;
		this.y = y;
		this.s = size;

		this.color = ['red','green','blue','yellow','purple','skyblue'];
		this.rand = rand(0,this.color.length-1);
		this.currentColor = this.color[this.rand];

		this.shapes = [
			[[0,1,0],
			 [1,1,1],
			 [0,0,0]],
			[[0,1,0,0],
			 [0,1,0,0],
			 [0,1,0,0],
			 [0,1,0,0]],
			[[1,1],
			 [1,1]],
			[[1,1,0],
			 [0,1,1],
			 [0,0,0]],
			[[1,0,0],
			 [1,1,1],
			 [0,0,0]]
		];

		this.randShape = rand(0,this.shapes.length-1);
		this.shape = this.shapes[this.randShape];

		this.grid = this.shape.length;

		this.fall = false;
	}

	rotate(){
		let new_shape = [];
		for(let i = 0; i < this.grid; i++){
			new_shape.push([]);
			for(let x = 0; x < this.grid; x++){
				new_shape[i].push(0);
			}
		}
		
		let pass = true;
		for(let i = 0; i < this.grid; i++){
			for(let x = 0; x < this.grid; x++){
				if(game_grid[this.y+i][this.x+x] == 0){
					new_shape[i][x] = this.shape[x][this.grid - i - 1];
				}else{
					pass = false;					
				}
			}
		}

		if(pass){
			this.shape = new_shape;
		}
	}

	update(){
		let pass = true;
		for(let i = 0; i < this.grid; i++){
			for(let x = 0; x < this.grid; x++){
				let realX = this.x + x;
				let realY = this.y + i + 1;
				if(this.shape[i][x] == 1){
					if(realY >= game_grid.length){
						pass = false;
						break;
					}
					if(game_grid[realY][realX]){
						pass = false;
					}
				}
			}
		}

		if(pass){
			this.y++;
		}else{
			timeLimit = 40;
			this.fall = true;
			drawBlock();
			for(let i = 0; i < this.grid; i++){
				for(let x = 0; x < this.grid; x++){
					if(this.y != -1){
						if(this.shape[i][x] == 1){
							let doneX = this.x+x;
							let doneY = this.y+i;
							game_grid[doneY][doneX] = 1;
						}
					}
				}
			}
		}
	}

	draw(){
		for(let i = 0; i < this.grid; i++){
			for(let x = 0; x < this.grid; x++){
				if(this.shape[i][x] == 1){
					let drawX = (this.x + x)*this.s;
					let drawY = (this.y + i)*this.s;
					this.ddraw(drawX,drawY);
				}
			}
		}
	}

	ddraw(drawX,drawY){
		ctx.beginPath();
		ctx.fillStyle = this.currentColor;
		ctx.fillRect(drawX,drawY,this.s,this.s);
		ctx.closePath();
	}
}
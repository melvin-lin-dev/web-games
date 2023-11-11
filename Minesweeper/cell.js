class Cell{
  constructor(x,y,type){
    this.x = x;
    this.y = y;
    this.reveal = false;
    this.type = type;
    if(type == 'number'){
      this.value = 0;
    }

    this.line = [];

    this.flag = false;
  }

  generateLine(){
    let x = this.x/cellSize;
    let y = this.y/cellSize;

    let left = cell[x-1 + "|" + y];

    let topLeft = cell[x-1 + "|" + (y-1)];
    let top = cell[x + "|" + (y-1)];
    let topRight = cell[x+1 + "|" + (y-1)];
    
    let right = cell[x+1 + "|" + y];
    
    let bottomRight = cell[x+1 + "|" + (y+1)];
    let bottom = cell[x + "|" + (y+1)];
    let bottomLeft = cell[x-1 + "|" + (y+1)];
    
    if(left) this.line.push(0);
    if(topLeft) this.line.push(2);
    if(top) this.line.push(1);
    if(topRight) this.line.push(3);
    if(right) this.line.push(4);
    if(bottomRight) this.line.push(5);
    if(bottom) this.line.push(6);
    if(bottomLeft) this.line.push(7);
  }

  draw(){
    let posX = this.x+cellSize/2;
    let posY = this.y+cellSize/2;
    if(this.type == 'bee'){
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'grey';
      ctx.arc(posX,posY,cellSize-31.7,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }else{
      ctx.save();
      ctx.font = '40px segoe ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if(this.value == 1) ctx.fillStyle = 'blue';
      if(this.value == 2) ctx.fillStyle = 'green';
      if(this.value == 3) ctx.fillStyle = 'red';
      if(this.value == 4) ctx.fillStyle = 'purple';
      if(this.value == 5) ctx.fillStyle = 'darkred';
      ctx.fillText(this.value,posX,posY);
      ctx.restore();
    }

    if(!this.reveal){
      ctx.save();
      ctx.beginPath();
      if(this.flag) ctx.fillStyle = 'red' 
      else ctx.fillStyle = 'white';
      ctx.fillRect(this.x,this.y,cellSize,cellSize);
      ctx.closePath();
      ctx.restore();
    }
  }
}
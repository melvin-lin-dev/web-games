let move = 30;
let differenceX, differenceY;
function drawBoard(){
    for(let i = 0; i < s; i++){
        game_grid.push([]);
        for(let x = 0; x < s; x++){
            let w = cvs.width / s;
            let h = cvs.height / s;
            let gem = rand(0, 6);
            game_grid[i].push(new Gem(x, i, w, h, gem));
        }
    }

    differenceX = game_grid[0][1].x - game_grid[0][0].x;
    speedX = differenceX / move;

    differenceY = game_grid[1][0].y - game_grid[0][0].y;
    speedY = differenceY / move;
}
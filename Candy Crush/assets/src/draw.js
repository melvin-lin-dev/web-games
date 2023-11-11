function updateGems(){
    for(let i = 0; i < s; i++){
        for(let x = 0; x < s; x++){
            let gem = game_grid[i][x];
            if(gem){
                gem.draw();

                if(gem.w < 0 && gem.h < 0){
                    game_grid[i][x] = '';
                    score += gem.score;

                    if(gem.type >= 7){
                        powerUpActived = false;
                    }
                }
            }
        }
    }
}
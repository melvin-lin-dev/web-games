function generatePlayers(){
    for(let i = 0; i < 4; i++){
        let rotation = i * 90 - 45;
        let playerX = planet.radius * Math.cos(rotation);
        let playerY = planet.radius * Math.sin(rotation);
        players.push(new Player(playerX, playerY, rotation));
    }
}

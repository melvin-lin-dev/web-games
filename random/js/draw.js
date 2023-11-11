function draw(){
    ball.update();
    ball.draw();
}

function drawPlayers(){
    players.forEach(player => {
        player.draw();
    })
}

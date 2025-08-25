function generatePlayer(){
    player = new Player(cvs.width / 2, cvs.height / 2);
}

function generateEnemies(){
    enemyInterval = setInterval(() => {
        enemies.push(new Enemy());
    }, 1000);
}

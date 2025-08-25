function check() {
    enemies.forEach((enemy, eIndex) => {
        if (Helper.isCollide(player, enemy) && !enemy.isDead) {
            gameOver = true;
        }

        player.bullets.forEach((bullet, bIndex) => {
            if (Helper.isCollide(bullet, enemy)) {
                player.bullets.splice(bIndex, 1);
                enemy.isDead = true;
                score += 5;
            }
        });

        enemy.bullets.forEach(bullet => {
            if (Helper.isCollide(player, bullet)) {
                gameOver = true;
            }
        });

        if (enemy.isDead && !enemy.bullets.length) {
            enemies.splice(eIndex, 1);
        }
    });
}

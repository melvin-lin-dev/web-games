socket.on('player_join', data => {
    data.ids.forEach((id, index) => {
        players[index] = new Player(id, cvs.width / 2 - 100, cvs.height / 2);

        if (socket.id === id) {
            player = players[index];
            playerIndex = index;


            setTimeout(() => {
                player.loadBall();
            }, 300);
        }
    });

    starting();
});

socket.on('player_rotate', data => {
    // console.log(data.id, players);
    players[data.id].rotate = data.rotate;
    // console.log(players[data.id].rotate);
});

socket.on('player_load_ball', data => {
    players[data.id].ball.current = new Ball(data.id, data.current);
    players[data.id].ball.future = new Ball(data.id, data.future);
});

socket.on('player_shoot', data => {
    players[data.id].ball.current.rotate.value = data.rotate;
    shootBalls[data.id].push(players[data.id].ball.current);
    // console.log(shootBalls[data.id][0], players[data.id]);

    players[data.id].ball.current = players[data.id].ball.future;
    players[data.id].ball.future = new Ball(data.id, data.future);

    // alert('b');

    sound('shoot');
});

socket.on('generate_ball', data => {
    // for (let id in players) {
    // console.log(milliseconds);
    // if (balls[data.id].length) {
    //     // console.log(balls[data.id][balls[data.id].length - 1].percent > ball.margin);
    //     if (!gameOver && balls[data.id][balls[data.id].length - 1].percent > ball.margin) {
    //         console.log('a');
    //         balls[data.id].push(new Ball(data.id, data.type));
    //     }
    // } else {
        balls[data.id].push(new Ball(data.id, data.type));
    // }
    // }
});

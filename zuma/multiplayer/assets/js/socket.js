socket.on('room_choose_map', data => {
    document.querySelector('.room-id').innerHTML = data.roomId;
    document.querySelector('.room-id').classList.add('active');
});

socket.on('room_join_failed', data => {
    document.querySelector('.error-text').innerHTML = data.message;
    document.querySelector('.error-text').classList.add('active');
});

socket.on('get_player_name', () => {
    socket.emit('set_player_name', {
        name: document.querySelector('.room-container.active .player-name').value
    });
});

socket.on('game_start', data => {
    document.querySelector('.create-room-container').classList.remove('active');
    document.querySelector('.join-room-container').classList.remove('active');

    let map = JSON.parse(data.map);
    gameInitialization(map.paths);
    assignPlayer(data.players, map.player);

    setTimeout(() => {
        document.querySelector('.countdown-container').classList.add('active');

        setTimeout(() => {
            document.querySelector('.countdown-container').classList.remove('active');

            setTimeout(() => {
                mainContainer.classList.add('active');

                setTimeout(() => {
                    starting();
                });
            }, 500);
        }, 4000);
    }, 400);
});

socket.on('player_rotate', data => {
    players[data.id].rotate = data.rotate;
});

socket.on('player_load_ball', data => {
    players[data.id].ball.current = new Ball(data.id, data.current);
    players[data.id].ball.future = new Ball(data.id, data.future);
});

socket.on('player_shoot', data => {
    players[data.id].ball.current.rotate.value = data.rotate;
    shootBalls[data.id].push(players[data.id].ball.current);

    players[data.id].ball.current = players[data.id].ball.future;
    players[data.id].ball.future = new Ball(data.id, data.future);

    sound('shoot');
});

socket.on('player_swap_ball', data => {
    let currentPlayer = players[data.id].ball;

    let tempCurrentBall = currentPlayer.current;
    currentPlayer.current = currentPlayer.future;
    currentPlayer.future = tempCurrentBall;
});

socket.on('generate_ball', data => {
    balls[data.id].push(new Ball(data.id, data.type));
});

socket.on('player_disconnect', data => {
    gameOver = data.playerId.toString();
});

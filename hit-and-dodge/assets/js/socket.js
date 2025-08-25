socket.on('room_create', data => {
    startContainer.classList.remove('active');

    setTimeout(() => {
        createRoomContainer.classList.add('active');
        createRoomContainer.querySelector('.room-id').innerHTML = data.roomId;
        createRoomContainer.querySelector('.player-name').innerHTML = data.name;
    }, 400);
});

socket.on('room_join', data => {
    startContainer.classList.remove('active');
    startContainer.querySelector('.error-text').innerHTML = '';

    setTimeout(() => {
        createRoomContainer.classList.add('active');
        createRoomContainer.classList.add('waiting');
        createRoomContainer.querySelector('.player-name').innerHTML = data.name;
    }, 400);
});

socket.on('room_join_failed', data => {
    let errorText = startContainer.querySelector('.error-text');
    errorText.innerHTML = data.message;
    errorText.classList.add('active');
});

socket.on('room_leave', data => {
    createRoomContainer.classList.remove('active');

    setTimeout(() => {
        startContainer.classList.add('active');
    }, 400);
});

socket.on('game_start', data => {
    if (createRoomContainer.classList.contains('active')) {
        createRoomContainer.classList.remove('active');
    } else {
        startContainer.classList.remove('active');
    }

    ball = new Ball(data.ball.rotation, data.ball.direction);
    generatePlayers(data.players);

    setTimeout(() => {
        countdownContainer.classList.add('active');

        setTimeout(() => {
            countdownContainer.classList.remove('active');
            setTimeout(() => {
                playerContainer.classList.add('active');

                setTimeout(() => {
                    start();
                }, 200);
            }, 400);
        }, 4000);
    }, 400);
});

socket.on('player_hit', data => {
    players[data.playerIndex].weapon.animate = true;

    if (checkHitZone(players[data.playerIndex])) {
        ball.hit();
    }
});

socket.on('player_dodge', data => {
    players[data.playerIndex].duck.animate = true;
});

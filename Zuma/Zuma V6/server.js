const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.render('index');
});

const io = require('socket.io')(app.listen(2222));

const rooms = {};

io.on('connection', (socket) => {
    console.log('New user connected');

    let maxPlayer = 2;

    // Server Functionality

    socket.on('room_create', data => {
        socket.join(data.roomId);
        rooms[data.roomId] = {
            map: data.map,
            players: {}
        };
        delete data.map;

        io.to(socket.id).emit('room_choose_map', data);
    });

    socket.on('room_leave', data => {
        socket.leave(data.roomId);
        delete rooms[data.roomId];
    });

    socket.on('room_join', data => {
        let currentRoom = io.sockets.adapter.rooms[data.roomId];
        let failedMessage;

        if (currentRoom && data.roomId.length <= 8) {
            if (currentRoom.length < maxPlayer) {
                socket.join(data.roomId);
                rooms[data.roomId].players = {...currentRoom.sockets};

                io.to(data.roomId).emit('get_player_name');
            } else {
                failedMessage = `Room already in play`;
            }
        } else {
            failedMessage = `Room ${data.roomId} doesn't exist`;
        }

        if (failedMessage) {
            io.to(socket.id).emit('room_join_failed', {
                message: failedMessage
            });
        }
    });

    socket.on('set_player_name', data => {
        let roomId = getId().roomId;
        let players = rooms[roomId].players;

        players[socket.id] = data.name ? data.name : 'Player';

        let isPlayersNameSet = true;

        for (let id in players) {
            if (typeof players[id] === "boolean") {
                isPlayersNameSet = false;
            }
        }

        if (isPlayersNameSet) {
            io.to(roomId).emit('game_start', {
                players,
                map: rooms[roomId].map
            });
        }
    });

    // Game Functionality

    socket.on('player_rotate', data => {
        if (getId()) {
            io.to(getId().roomId).emit('player_rotate', {...data, id: getId().index});
        }
    });

    socket.on('player_load_ball', data => {
        io.to(getId().roomId).emit('player_load_ball', {...data, id: getId().index})
    });

    socket.on('player_shoot', data => {
        io.to(getId().roomId).emit('player_shoot', {...data, id: getId().index})
    });

    socket.on('player_swap_ball', () => {
        io.to(getId().roomId).emit('player_swap_ball', {id: getId().index})
    });

    socket.on('generate_ball', data => {
        io.to(getId().roomId).emit('generate_ball', data);
    });

    socket.on('disconnect', () => {
        if (getId()) {
            io.to(getId().roomId).emit('player_disconnect', {
                playerId: getId().index
            });

            delete rooms[getId().roomId];
        }
    });

    function getId() {
        for (const roomId in rooms) {
            let index = Object.keys(rooms[roomId].players).indexOf(socket.id);

            if (index + 1 && roomId !== socket.id) {
                return {roomId, index};
            }
        }
    }
});

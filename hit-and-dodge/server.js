const express = require('express');
const app = express();
const io = require('socket.io')(app.listen(3333));

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.render('index');
});

const rooms = {};

io.on('connection', socket => {
    // console.clear();
    console.log('new player connected');

    socket.on('room_create', data => {
        joinRoom(data);

        data.name = rooms[data.roomId][socket.id];

        io.to(socket.id).emit('room_create', data);
    });

    socket.on('room_join', data => {
        let roomExist = false;

        for (let roomId in rooms) {
            if (roomId === data.roomId) {
                roomExist = true;
            }
        }

        let message;

        if (roomExist) {
            if (io.sockets.adapter.rooms[data.roomId].length < 4) {
                joinRoom(data);

                data.name = rooms[data.roomId][socket.id];

                if (io.sockets.adapter.rooms[data.roomId].length === 4) {
                    let rotations = [0, 90, 180, 270];
                    let directions = [-1,1];

                    io.to(data.roomId).emit('game_start', {
                        players: rooms[data.roomId],
                        ball: {
                            rotation: rotations[random(0, rotations.length - 1)],
                            direction: directions[random(0, directions.length - 1)]
                        }
                    });
                } else {
                    io.to(socket.id).emit('room_join', data);
                }
            } else {
                message = `Room <span>${data.roomId}</span> already in play`;
            }
        } else {
            message = `Room <span>${data.roomId}</span> doesn't exist`;
        }

        if (message) {
            io.to(socket.id).emit('room_join_failed', {
                message
            });
        }
    });

    socket.on('room_leave', data => {
        if (getId().index) {
            socket.leave(getId().roomId);

            io.to(socket.id).emit('room_leave');

            delete rooms[getId().roomId][socket.id];
        } else {
            let players = rooms[getId().roomId];

            io.to(getId().roomId).emit('room_leave');

            for (let id in players) {
                io.sockets.sockets[id].leave(getId().roomId);
            }

            delete rooms[getId().roomId];
        }
    });

    socket.on('player_hit', data => {
        io.to(getId().roomId).emit('player_hit', {
            playerIndex: getId().index
        });
    });

    socket.on('player_dodge', data => {
        io.to(getId().roomId).emit('player_dodge', {
            playerIndex: getId().index
        });
    });

    function getId() {
        for (let roomId in rooms) {
            let index = Object.keys(rooms[roomId]).indexOf(socket.id);

            if (index + 1) {
                return {
                    roomId: roomId,
                    index
                };
            }
        }
    }

    function joinRoom(data) {
        socket.join(data.roomId);
        rooms[data.roomId] = {...io.sockets.adapter.rooms[data.roomId].sockets, ...rooms[data.roomId]};
        rooms[data.roomId][socket.id] = data.name ? data.name : 'Player ' + (getId().index + 1);
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

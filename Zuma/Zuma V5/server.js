const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.render('index');
});

const io = require('socket.io')(app.listen(2222));

let players = [];

io.on('connection', (socket) => {
    console.log('New user connected');

    let maxPlayer = 2;

    socket.on('player_join', data => {
        if (players.length === 2) {
            players = [];
        }

        players.push(socket.id);

        console.log(players);

        if (players.length - 1 && players.length <= maxPlayer) {
            io.sockets.emit('player_join', {ids: players});
        }
    });

    socket.on('player_rotate', data => {
        io.sockets.emit('player_rotate', {...data, id: getId()});
    });

    socket.on('player_load_ball', data => {
        io.sockets.emit('player_load_ball', {...data, id: getId()})
    });

    socket.on('player_shoot', data => {
        io.sockets.emit('player_shoot', {...data, id: getId()})
    });

    socket.on('generate_ball', data => {
        io.sockets.emit('generate_ball', data);
    });

    socket.on('disconnect', data => {
        // players.splice(players.indexOf(socket.id), 1);
    });

    function getId() {
        return players.indexOf(socket.id);
    }
});

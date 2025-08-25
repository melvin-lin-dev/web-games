const express = require('express');
const app = express();
const io = require('socket.io')(app.listen(4444));

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', socket => {

});

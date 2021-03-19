const express = require('express');
const cors = require('cors');
const { createServer } = require('http')
const socketIo = require('socket.io');

const app = express();
const server = createServer(app);
const io = socketIo(server);

app.use(cors());

let chats = [];

io.on("connection", socket => {
    console.log("a user connected :D");
    socket.on("send message", msg => {
        chats = [...chats, msg];
        io.emit("send message", msg);
    });

    socket.on('fetch message', () => {
        socket.emit('fetch message', chats);
    });

    socket.on('disconnect', reason => {
        console.log('user DISCONNECTED...');
    });
});

app.get('/', (_, res) => {
    res.json({ text: 'welcome to socket chat service!!' });
});

app.use('/', routes);

server.listen(3000, () => console.log('app listening to port 3000'));

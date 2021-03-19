const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const { createServer } = require('http')

const app = express();
const server = createServer(app);
const io = socketIo(server);
const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let chats = [];

mongoose.connect('mongodb://localhost/chat-db', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to MongoDB Ngobrol Film Database!'))
    .catch(err => console.log(err, 'failed to connecting mongoDB server database.'));

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
    res.json({ text: 'welcome to real time chat service!!' });
});

app.use('/', routes);

server.listen(3000, () => console.log('app listening to port 3000'));

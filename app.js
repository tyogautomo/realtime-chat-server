const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const { createServer } = require('http')

const app = express();
const server = createServer(app);
const io = socketIo(server);
const routes = require('./routes');
const { SocketManager } = require('./socket/socketManager');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost/chat-db', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to Real Time CHAT DB!'))
    .catch(err => console.log(err, 'failed to connecting mongoDB server database.'));

io.on('connection', (socket) => SocketManager.connection(socket, io));
app.get('/', (_, res) => { res.json({ text: 'welcome to real time chat service!!' }) });
app.use('/', routes);

server.listen(3000, () => console.log('app listening to port 3000'));

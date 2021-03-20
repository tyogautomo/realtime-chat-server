const { MessageController } = require('../controllers/messageController');
let chats = [];

const connectingSocket = (io) => {
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
}

module.exports = { connectingSocket };
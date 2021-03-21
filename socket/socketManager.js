const { MessageController } = require('../controllers/messageController');
// const { RoomController } = require('../controllers/roomController');
const { UserController } = require('../controllers/userController');
let chats = [];

class SocketManager {
    static connection(socket, io) {
        console.log('a user connected :D with ID =>' + socket.id);

        socket.on('join room', async (roomId) => {
            console.log(`user ${socket.id} join room: ${roomId}`);
            socket.join(roomId);
        });

        socket.on('leave room', roomId => {
            console.log(`user ${socket.id} leave room: ${roomId}`);
            socket.leave(roomId);
        });

        socket.on('send message', async (payload) => {
            const { roomId } = payload;
            const message = await MessageController.createMessage(payload);
            console.log(message, 'new message on backend <<<<<<<<<<');
            io.to(roomId).emit('send message', message);
        });

        socket.on('fetch message', () => {
            socket.emit('fetch message', chats);
        });

        socket.on('get active chats', async (username) => {
            const user = await UserController.getLoggedUser(username);
            console.log('get user on backend.....');
            socket.emit('get active chats', user.activeChats);
        });

        socket.on('disconnect', reason => {
            console.log('DISCONNECTED...| reason: ' + reason);
        });

        socket.on('connect', () => {
            console.log('user reconnected...');
        });
    }
}

module.exports = { SocketManager };
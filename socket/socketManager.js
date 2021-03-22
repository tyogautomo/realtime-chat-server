const { MessageController } = require('../controllers/messageController');
const { RoomController } = require('../controllers/roomController');
const { UserController } = require('../controllers/userController');

class SocketManager {
    constructor() {
        this.onlineUsers = [];
        this.onAppUsers = [];
    }

    connection(socket, io) {
        console.log('a user connected with ID =>' + socket.id);

        socket.on('init chat', async ({ userId, friendId }) => {
            const room = await RoomController.createRoom(userId, friendId);
            const { isNewActive } = await UserController.addActiveChat(userId, room._id);
            socket.emit('init chat', { room, isNewActive, friendId });
        });

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
            const updatedRoom = await RoomController.updateLastMessage(message, roomId);
            io.to(roomId).emit('send message', { message, updatedRoom });
        });

        socket.on('fetch messages', async (roomId) => {
            const messages = await MessageController.getRoomMessages(roomId);
            socket.emit('fetch messages', messages);
        });

        socket.on('get active chats', async (userId) => {
            const activeChats = await UserController.getActiveChats(userId);
            console.log('get active chats on backend.....');
            socket.emit('get active chats', activeChats);
        });

        socket.on('identity', (userId) => {
            const payload = {
                userId,
                socketId: socket.id
            }
            this.onlineUsers.push(payload);
            this.onAppUsers.push(payload);
        });

        socket.on('active app', (userId) => {
            console.log(`${userId} is active`);
            this.onAppUsers.push({
                userId,
                socketId: socket.id
            });
        });

        socket.on('background app', (userId) => {
            console.log(`${userId} is background`);
            this.onAppUsers = this.onAppUsers.filter(user => user._id !== userId);
        });

        socket.on('disconnect', reason => {
            this.onlineUsers = this.onlineUsers.filter(user => user.socketId !== socket.id);
            this.onAppUsers = this.onAppUsers.filter(user => user.socketId !== socket.id);
            console.log(this.onlineUsers, 'disconnected...');
            console.log('DISCONNECTED...| reason: ' + reason);
        });
    }
}

module.exports = { SocketManager };

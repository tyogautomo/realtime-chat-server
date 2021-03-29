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

        socket.on('add friend', async (friendId, userId) => {
            const { currentData, friendData } = await UserController.addFriend(friendId, userId);
            const friendConn = this.onlineUsers.filter(user => user.userId === friendId);
            friendConn.forEach(user => {
                user.socket.emit('add friend', currentData);
            });
            socket.emit('add friend', friendData);
        });

        socket.on('init chat', async ({ userId, friendId }) => {
            const room = await RoomController.createRoom(userId, friendId);
            const { isNewActive } = await UserController.addActiveChat(userId, room._id);

            socket.emit('init chat', { room, isNewActive, friendId });
        });

        socket.on('join room', async (roomIds) => {
            if (roomIds.length !== 0) {
                console.log(`user ${socket.id} join room: ${roomIds}`);
                socket.join(roomIds);
            }
        });

        socket.on('leave room', (roomId) => {
            console.log(`user ${socket.id} leave room: ${roomId}`);
            socket.leave(roomId);
        });

        socket.on('send message', async (payload) => {
            const { roomId, recipientId } = payload;
            const message = await MessageController.createMessage(payload);
            const updatedRoom = await RoomController.addLastAndUnreadMessage(message._id, roomId);
            await UserController.addActiveChat(recipientId, roomId);
            this.subscribeAnotherUser(recipientId, roomId, socket);

            io.to(roomId).emit('send message', { message, updatedRoom });
        });

        socket.on('fetch messages', async (roomId) => {
            const messages = await MessageController.getRoomMessages(roomId);
            socket.emit('fetch messages', messages);
        });

        socket.on('read messages', async (roomId, userId) => {
            const updatedMessages = await MessageController.readAllMessages(roomId, userId);
            const updatedRoom = await RoomController.removeUnreadMessages(roomId, userId);
            // console.log(JSON.stringify(updatedMessages, null, 2), 'updated messages <<<<<<<<<<<<<<<<<<<<');
            io.to(roomId).emit('read messages', { updatedMessages, updatedRoom });
        });

        socket.on('get active chats', async (userId) => {
            const activeChats = await UserController.getActiveChats(userId);
            socket.emit('get active chats', activeChats);
        });

        socket.on('identity', (userId) => {
            const payload = {
                userId,
                socket
            };
            this.onlineUsers.push(payload);
            this.onAppUsers.push(payload);
        });

        socket.on('active app', (userId) => {
            console.log(`${userId} is active`);
            this.onAppUsers.push({
                userId,
                socket
            });
        });

        socket.on('background app', (userId) => {
            console.log(`${userId} is background`);
            this.onAppUsers = this.onAppUsers.filter(user => user._id !== userId);
        });

        socket.on('disconnect', (reason) => {
            this.onlineUsers = this.onlineUsers.filter(user => user.socket.id !== socket.id);
            this.onAppUsers = this.onAppUsers.filter(user => user.socket.id !== socket.id);
            console.log('DISCONNECTED...| reason: ' + reason);
        });
    }

    subscribeAnotherUser(recipientId, roomId, socket) {
        const friends = this.onlineUsers.filter(user => user.userId === recipientId);
        socket.join(roomId);
        friends.forEach(user => {
            user.socket.join(roomId);
        });
    }
}

module.exports = { SocketManager };

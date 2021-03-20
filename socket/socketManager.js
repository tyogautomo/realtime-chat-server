const { MessageController } = require('../controllers/messageController');
const { UserController } = require('../controllers/userController');
let chats = [];

class SocketManager {
    static connection(socket) {
        console.log("a user connected :D with ID =>" + socket.id);
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

        socket.on('get active chats', async (username) => {
            const user = await UserController.getLoggedUser(username);
            socket.emit('get active chats', user.activeChats);
        });
    }
}

module.exports = { SocketManager };
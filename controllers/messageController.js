const { Message } = require('../models/messageModel');

class MessageController {
    static async createMessage(data) {
        try {
            const { senderId, recipientId, message, roomId } = data;
            const payload = {
                sender: senderId,
                recipient: recipientId,
                message,
                room: roomId
            };
            const newMessage = await Message.create(payload);
            const populatedMessage = Message
                .findById(newMessage._id)
                .populate({ path: 'sender', select: 'username' })
                .select('-__v');
            return populatedMessage;
        } catch (error) {
            console.log(error.message, 'error on createMessage <<<');
            return error;
        }
    }

    static async getRoomMessages(roomId) {
        try {
            const messages = await Message
                .find({ room: roomId })
                .populate({ path: 'sender', select: 'username' })
                .select('-__v');
            return messages;
        } catch (error) {
            console.log(error.messages, 'error when getRoomMessages <<<');
            return error;
        }
    }
}

module.exports = { MessageController };

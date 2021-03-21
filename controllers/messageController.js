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
            return newMessage;
        } catch (error) {
            console.log(error.message, 'error on createMessage <<<');
            return error;
        }
    }

    static async getRoomMessages(req, res) {
        try {
            const { roomId } = req.params;
            const messages = await Message
                .find({ room: roomId })
                .populate({ path: 'sender', select: 'username' })
                .select('-__v');
            res.status(200).json(messages);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = { MessageController };

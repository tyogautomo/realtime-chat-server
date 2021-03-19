const { Message } = require('../models/messageModel');

class MessageController {
    static async createMessage(req, res, next) {
        try {
            const { senderId, recipientId, message } = req.body;
            const payload = {
                sender: senderId,
                recipient: recipientId,
                message
            };
            const newMessage = await Message.create(payload);
            res.status(201).json(newMessage);
        } catch (error) {
            res.json(error);
        }
    }

    static async getRoomMessages(req, res, next) {
        try {
            const { senderId, recipientId } = req.query;
            const messages = await Message
                .find()
                .or([
                    { sender: senderId, recipient: recipientId },
                    { sender: recipientId, recipient: senderId }
                ])
                .populate({ path: 'sender', select: 'username' })
                .select('-__v');
            res.status(200).json(messages);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = { MessageController };

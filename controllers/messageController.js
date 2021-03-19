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
            const message = await Message.create(payload);
            res.status(201).json(message);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = { MessageController };

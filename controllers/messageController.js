const { Message } = require('../models/messageModel');
const { Room } = require('../models/roomModel');

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
                .populate({ path: 'sender', select: 'username backgroundColor' })
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
                .populate({ path: 'sender', select: 'username backgroundColor' })
                .select('-__v');
            return messages;
        } catch (error) {
            console.log(error.messages, 'error when getRoomMessages <<<');
            return error;
        }
    }

    static async readAllMessages(roomId, userId) {
        try {
            const room = await Room
                .findById(roomId)
                .populate({ path: 'unreadMessages', model: 'Message' });
            if (room) {
                const messages = room.unreadMessages.filter(msg => msg.recipient.toString() === userId.toString());
                messages.forEach(async msg => {
                    await Message.updateOne({ _id: msg._id }, { read: true });
                });
                const updatedMessages = await this.getRoomMessages(roomId);
                return updatedMessages;
            } else {
                console.log('error when readAllMessages <<<');
            }
        } catch (error) {
            console.log(error.messages, 'error when readAllMessages <<<');
            return error;
        }
    }

    static async deleteAll(req, res) {
        try {
            await Message.deleteMany();
            res.status(200).json({ message: 'successfuly deleted all messages' });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { MessageController };

const { Room } = require('../models/roomModel');

class RoomController {
  static async createRoom(userId, friendId) {
    try {
      const room = await Room
        .findOne({
          participants: {
            $all: [userId, friendId]
          }
        })
        .populate({ path: 'participants', model: 'User', select: 'username backgroundColor' })
        .select('-__v');
      if (!room) {
        const payload = {
          participants: [userId, friendId]
        };
        const newRoom = await Room.create(payload);
        const populatedRoom = await Room
          .findById(newRoom._id)
          .populate({ path: 'participants', model: 'User', select: 'username backgroundColor' })
          .select('-__v');
        return populatedRoom;
      } else {
        return room;
      }
    } catch (error) {
      console.log(error.message, 'error creating room <<<<<<');
      return error;
    }
  }

  static async updateLastMessage(message, roomId) {
    try {
      const payload = { lastMessage: message };
      const room = await Room
        .findOneAndUpdate({ _id: roomId }, payload, { new: true })
        .populate({
          path: 'participants',
          model: 'User',
          select: 'username backgroundColor'
        })
        .populate({
          path: 'lastMessage',
          model: 'Message',
          select: 'message'
        })
        .select('-__v');
      return room;
    } catch (error) {
      console.log(error, 'error when updateLastMessage');
      return error;
    }
  }

  static async deleteAll(req, res) {
    try {
      await Room.deleteMany();
      res.status(200).json({ message: 'successfuly deleted all room' });
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = { RoomController };

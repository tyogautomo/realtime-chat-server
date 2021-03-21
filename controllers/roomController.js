const { Room } = require('../models/roomModel');

class RoomController {
  static async createRoom(userId, friendId) {
    try {
      const room = await Room
        .findOne()
        .all('participants', [userId, friendId])
        .select('-__v');
      if (!room) {
        const payload = {
          participants: [userId, friendId]
        };
        const newRoom = await Room.create(payload);
        return newRoom;
      } else {
        return room;
      }
    } catch (error) {
      console.log(error.message, 'error creating room <<<<<<');
      return error;
    }
  }

  static async updateLastMessage(message, roomId, senderId) {
    try {
      const payload = { lastMessage: message };
      const room = await Room
        .findOneAndUpdate({ _id: roomId }, payload, { new: true })
        .populate({
          path: 'participants',
          model: 'User',
          select: 'username'
        })
        .populate({
          path: 'lastMessage',
          model: 'Message',
          select: 'message'
        })
        .select('-__v');
      const formattedRoom = { ...room._doc };
      const recipient = formattedRoom.participants.filter(userInfo => userInfo._id.toString() != senderId.toString())[0];
      formattedRoom.recipient = recipient;
      delete formattedRoom.participants;

      return formattedRoom;
    } catch (error) {
      console.log(error, 'error when updateLastMessage');
      return error;
    }
  }

  static async getUserRooms() {

  }

}

module.exports = { RoomController };

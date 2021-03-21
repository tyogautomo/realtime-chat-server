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
        return newRoom
      } else {
        return room;
      }
    } catch (error) {
      console.log(error.message, 'error creating room <<<<<<');
      return error;
    }
  }

  static async getUserRooms() {

  }
}

module.exports = { RoomController };

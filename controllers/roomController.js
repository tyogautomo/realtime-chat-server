const { Room } = require('../models/roomModel');

class RoomController {
  static async createRoom(req, res, next) {
    try {
      const { userId, friendId } = req.body;
      const room = await Room
        .findOne()
        .or([
          { participants: userId },
          { participants: friendId }
        ])
        .select('-__v');
      if (!room) {
        const payload = {
          participants: [userId, friendId]
        };
        const newRoom = await Room.create(payload);
        res.status(201).json(newRoom);
      } else {
        res.status(200).json(room);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getUserRooms(req, res, next) {

  }
}

module.exports = { RoomController };

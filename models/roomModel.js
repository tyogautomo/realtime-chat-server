const { Schema, Types: { ObjectId }, model } = require('mongoose');

const roomSchema = new Schema({
  participants: {
    type: [ObjectId],
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: ObjectId,
    ref: 'Message',
    default: ''
  },
  roomType: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Room = model('Room', roomSchema);

module.exports = { Room };

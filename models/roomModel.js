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
    default: null
  },
  roomType: {
    type: String,
    default: 'PRIVATE'
  },
  unreadMessages: {
    type: [ObjectId],
    ref: 'Message'
  }
}, {
  timestamps: true
});

const Room = model('Room', roomSchema);

module.exports = { Room };

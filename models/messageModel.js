const { Schema, model, Types: { ObjectId } } = require('mongoose');

const messageSchema = new Schema({
    sender: {
        type: ObjectId,
        ref: 'User'
    },
    recipient: {
        type: ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Message = model('Message', messageSchema);

module.exports = { Message };

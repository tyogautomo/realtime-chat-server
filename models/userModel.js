const { model, Schema, Types: { ObjectId } } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [ObjectId],
        ref: 'User'
    }
}, {
    timestamps: true
});

const User = model('User', userSchema);

module.exports = { User };

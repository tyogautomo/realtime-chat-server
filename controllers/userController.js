const { User } = require('../models/userModel');

class UserController {
    static async createUser(req, res) {
        try {
            const { username, password } = req.body;
            const payload = { username, password };
            const user = await User.create(payload);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async signIn(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User
                .findOne({ username })
                .populate({
                    path: 'activeChats',
                    model: 'Room',
                    select: '-__v -createdAt',
                    populate: {
                        path: 'participants',
                        model: 'User',
                        select: 'username'
                    }
                })
                .select('-__v');
            if (user && (password === user.password)) {
                const payload = { ...user._doc };
                delete payload.password;
                const newActiveChats = payload.activeChats.map(room => {
                    const newPayload = { ...room._doc };
                    const recipient = newPayload.participants.filter(userInfo => userInfo._id.toString() != user._id.toString())[0];
                    newPayload.recipient = recipient;
                    delete newPayload.participants;
                    return newPayload;
                });
                payload.activeChats = newActiveChats;
                res.status(200).json(payload);
            } else {
                res.status(401).json({
                    code: 401,
                    message: 'Wrong username/password'
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async getLoggedUser(username) {
        try {
            const user = await User
                .findOne({ username })
                .populate({
                    path: 'activeChats',
                    model: 'Room',
                    select: '-__v -createdAt',
                    populate: {
                        path: 'participants',
                        model: 'User',
                        select: 'username'
                    }
                })
                .select('-__v');
            if (user) {
                const payload = { ...user._doc };
                delete payload.password;
                const newActiveChats = payload.activeChats.map(room => {
                    const newPayload = { ...room._doc };
                    const recipient = newPayload.participants.filter(userInfo => userInfo._id.toString() != user._id.toString())[0];
                    newPayload.recipient = recipient;
                    delete newPayload.participants;
                    return newPayload;
                });
                payload.activeChats = newActiveChats;
                return payload;
            } else {
                console.log({
                    code: 404,
                    message: 'user not found.'
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = { UserController };

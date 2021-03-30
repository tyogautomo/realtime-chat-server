const { User } = require('../models/userModel');

const { getRandomColor } = require('../utils/helpers');

class UserController {
    static async createUser(req, res) {
        try {
            const { username, password } = req.body;
            const backgroundColor = getRandomColor();
            const payload = { username, password, backgroundColor };
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
                    populate: [
                        {
                            path: 'participants',
                            model: 'User',
                            select: 'username backgroundColor'
                        },
                        {
                            path: 'lastMessage',
                            model: 'Message',
                            select: 'message sender read createdAt',
                            populate: {
                                path: 'sender',
                                model: 'User',
                                select: 'username'
                            }
                        },
                        {
                            path: 'unreadMessages',
                            model: 'Message',
                            select: 'recipient',
                            populate: {
                                path: 'recipient',
                                model: 'User',
                                select: 'username'
                            }
                        }
                    ]
                })
                .populate({ path: 'friends', select: 'username backgroundColor' })
                .select('-__v');
            if (user && (password === user.password)) {
                const payload = { ...user._doc };
                delete payload.password;
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

    static async getUserData(req, res) {
        try {
            const { userId } = req.params;
            const user = await User
                .findById(userId)
                .populate({
                    path: 'activeChats',
                    model: 'Room',
                    select: '-__v -createdAt',
                    populate: [
                        {
                            path: 'participants',
                            model: 'User',
                            select: 'username backgroundColor'
                        },
                        {
                            path: 'lastMessage',
                            model: 'Message',
                            select: 'message sender read createdAt',
                            populate: {
                                path: 'sender',
                                model: 'User',
                                select: 'username'
                            }
                        },
                        {
                            path: 'unreadMessages',
                            model: 'Message',
                            select: 'recipient',
                            populate: {
                                path: 'recipient',
                                model: 'User',
                                select: 'username'
                            }
                        }
                    ]
                })
                .populate({ path: 'friends', select: 'username backgroundColor' })
                .select('-__v');
            if (user) {
                const payload = { ...user._doc };
                delete payload.password;
                res.status(200).json(payload);
            } else {
                res.status(404).json({ message: 'user not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async addActiveChat(userId, roomId) {
        try {
            const user = await User.findById(userId);
            if (user) {
                if (!user.activeChats.includes(roomId)) {
                    user.activeChats.push(roomId);
                    user.save();
                    return { isNewActive: true };
                } else {
                    return { isNewActive: false };
                }
            } else {
                console.log('user not found');
            }
        } catch (error) {
            console.log('error on addActiveChat');
            return error;
        }
    }

    static async getActiveChats(userId) {
        try {
            const user = await User
                .findOne({ _id: userId })
                .populate({
                    path: 'activeChats',
                    model: 'Room',
                    select: '-__v -createdAt',
                    populate: [
                        {
                            path: 'participants',
                            model: 'User',
                            select: 'username backgroundColor'
                        },
                        {
                            path: 'lastMessage',
                            model: 'Message',
                            select: 'message sender read createdAt',
                            populate: {
                                path: 'sender',
                                model: 'User',
                                select: 'username'
                            }
                        },
                        {
                            path: 'unreadMessages',
                            model: 'Message',
                            select: 'recipient',
                            populate: {
                                path: 'recipient',
                                model: 'User',
                                select: 'username'
                            }
                        }
                    ]
                })
                .select('-__v');
            if (user) {
                return user.activeChats;
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

    static async searchFriends(req, res) {
        try {
            const { q, userId } = req.query;
            const users = await User
                .find({
                    _id: {
                        $ne: userId
                    },
                    username: {
                        $regex: q,
                        $options: 'i'
                    }
                })
                .select('username friends');
            const friends = users
                .filter(user => !user.friends.includes(userId))
                .map(user => {
                    const newUser = { ...user._doc };
                    delete newUser.friends;
                    return newUser;
                });
            res.status(200).json(friends);
        } catch (error) {
            console.log(error);
            res.status(200).json(error);
        }
    }

    static async addFriend(friendId, userId) {
        try {
            const current = await User.findById(userId);
            const friend = await User.findById(friendId);
            current.friends.push(friendId);
            friend.friends.push(userId);
            current.save();
            friend.save();

            const friendData = { _id: friend._id, username: friend.username };
            const currentData = { _id: current.id, username: current.username };
            return { friendData, currentData };
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteAll(req, res) {
        try {
            await User.deleteMany();
            res.status(200).json({ message: 'successfuly deleted all users' });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { UserController };

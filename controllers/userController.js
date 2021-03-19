const { User } = require('../models/userModel');

class UserController {
    static async createUser(req, res, next) {
        try {
            const { username, password } = req.body;
            const payload = { username, password };
            const user = await User.create(payload);
            res.status(201).json(user);
        } catch (error) {
            res.json(error);
        }
    }

    static async signIn(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.find({ username });
            const payload = {
                userId: user._id,
                username
            };
            res.status(200).json(payload);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = { UserController };

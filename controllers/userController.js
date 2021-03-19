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
            const user = await User.findOne({ username });
            if ((password === user.password) && user) {
                const payload = {
                    userId: user._id,
                    username
                };
                res.status(200).json(payload);
            } else {
                res.status(401).json({
                    code: 401,
                    message: 'Wrong username/password'
                })
            }
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = { UserController };

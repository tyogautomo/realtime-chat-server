const { verifyToken } = require('../utils/helpers');

const authentication = (req, res, next) => {
    try {
        req.headers.decode = verifyToken(req.headers.token);
        next();
    } catch (error) {
        next({
            code: 401,
            message: 'Unauthenticated access.'
        });
    }
};

module.exports = {
    authentication
};

const createToken = (payload) => {
    return jwt.sign(payload, process.env.APP_SECRET);
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.APP_SECRET);
};

module.exports = {
    createToken,
    verifyToken
}
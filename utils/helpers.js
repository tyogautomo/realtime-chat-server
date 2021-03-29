const createToken = (payload) => {
  // return jwt.sign(payload, process.env.APP_SECRET);
};

const verifyToken = (token) => {
  // return jwt.verify(token, process.env.APP_SECRET);
};

const getRandomColor = () => {
  const r = 157 + Math.floor(Math.random() * 43);
  const g = 157 + Math.floor(Math.random() * 43);
  const b = 157 + Math.floor(Math.random() * 43);
  return `${r}, ${g}, ${b}`;
};

module.exports = {
  createToken,
  verifyToken,
  getRandomColor
}
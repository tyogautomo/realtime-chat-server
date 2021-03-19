const router = require('express').Router();

const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/user', userRoutes);
router.use('/message', messageRoutes);

module.exports = router;

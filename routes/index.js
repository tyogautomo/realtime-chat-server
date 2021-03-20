const router = require('express').Router();

const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');
const roomRoutes = require('./roomRoutes');

router.use('/user', userRoutes);
router.use('/message', messageRoutes);
router.use('/room', roomRoutes);

module.exports = router;

const router = require('express').Router();

const { RoomController } = require('../controllers/roomController');

router.post('/', RoomController.createRoom);

module.exports = router;

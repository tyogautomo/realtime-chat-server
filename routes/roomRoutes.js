const router = require('express').Router();

const { RoomController } = require('../controllers/roomController');

router.post('/', RoomController.createRoom);
router.delete('/', RoomController.deleteAll);

module.exports = router;

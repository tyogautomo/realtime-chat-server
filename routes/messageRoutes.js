const router = require('express').Router();

// const { authentication } = require('../middlewares/auth');
const { MessageController } = require('../controllers/messageController');

// router.use(authentication);

router.post('/', MessageController.createMessage);
router.get('/room-messages', MessageController.getRoomMessages);
router.delete('/', MessageController.deleteAll);

module.exports = router;

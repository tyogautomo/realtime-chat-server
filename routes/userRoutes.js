const router = require('express').Router();

const { UserController } = require('../controllers/userController');

router.post('/', UserController.createUser);
router.post('/signin', UserController.signIn);

module.exports = router;

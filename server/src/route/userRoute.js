const userController = require('../controller/userController');

const express = require('express');
const router = express.Router();

router.post('/signup', userController.user_signup_post);

router.post('/login', userController.user_login_post);

module.exports = router;

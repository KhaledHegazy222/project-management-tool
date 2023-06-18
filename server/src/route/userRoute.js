const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', userController.user_signup_post);
router.post('/login', userController.user_login_post);
router.get('/details', userController.user_details_get);

module.exports = router;

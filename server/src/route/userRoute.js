const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', userController.user_signup_post);
router.post('/login', userController.user_login_post);
router.get('/details', userController.user_details_get);

router.post('/verify', userController.user_send_verification_post);
router.post('/verify/:verificationId', userController.user_verify_post);
router.post('/reset_password', userController.user_send_reset_password_post);
router.post('/reset_password/:resetId', userController.user_reset_password_post);

module.exports = router;

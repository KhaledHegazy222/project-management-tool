const express = require('express');
const requestController = require('../controller/requestController');

const router = express.Router();

router.get('/', requestController.user_request_get);
router.patch('/seen', requestController.user_request_seen_patch);
router.post('/accept', requestController.user_accept_post);
router.post('/cancel', requestController.user_cancel_post);

module.exports = router;

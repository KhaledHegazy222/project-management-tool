const projectController = require('../controller/projectController');

const express = require('express');
const router = express.Router();

router.get('/', projectController.project_list_get);
router.post('/create', projectController.project_create_post);
router.get('/:project_id', projectController.project_detail_get);

module.exports = router;

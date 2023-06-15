const express = require('express');
const projectController = require('../controller/projectController');

const router = express.Router();

router.get('/', projectController.project_list_get);
router.post('/create', projectController.project_create_post);
router.get('/:projectId', projectController.project_detail_get);

module.exports = router;

const express = require('express');
const taskController = require('../controller/taskController');

const router = express.Router();

router.get('/project/:projectId', taskController.task_list_get);

router.get('/:taskId', taskController.task_detail_get);
router.patch('/:taskId', taskController.task_update_patch);
router.delete('/:taskId', taskController.task_delete);
router.post('/create', taskController.task_create_post);

router.post('/:taskId/comment/create', taskController.task_comment_create_post);
router.get('/:taskId/comment', taskController.task_comment_list_get);

module.exports = router;

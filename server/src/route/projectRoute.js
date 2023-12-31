const express = require('express');
const projectController = require('../controller/projectController');

const router = express.Router();

router.get('/', projectController.project_list_get);
router.post('/create', projectController.project_create_post);
router.delete('/:projectId', projectController.project_delete);
router.get('/:projectId', projectController.project_detail_get);
router.post('/:projectId/star', projectController.project_star_post);
router.delete('/:projectId/star', projectController.project_star_delete);
router.post('/:projectId/member', projectController.project_member_post);
router.get('/:projectId/member', projectController.project_member_get);

module.exports = router;

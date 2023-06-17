const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const checkHelper = require('../middlewares/checkHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

exports.task_create_post = [
  body('project_id')
    .trim()
    .isInt()
    .withMessage('Must be a integer number'),
  body('task_assignee_id')
    .trim()
    .isInt()
    .withMessage('Must be a integer number'),
  body('task_reviewer_id')
    .trim()
    .isInt()
    .optional({ nullable: true })
    .withMessage('Must be a integer number'),
  body('task_title')
    .isLength({ min: 1 })
    .escape()
    .withMessage('Task title must be specified'),
  body('task_state')
    .isIn(['New Request', 'In Progress', 'On Review', 'Complete'])
    .escape()
    .withMessage('Invalid value'),
  body('task_due_date')
    .isISO8601()
    .toDate()
    .optional({ nullable: true })
    .withMessage('Invalid Date format'),
  body('task_description')
    .escape()
    .optional({ nullable: true }),
  authHelper.authenticateToken,
  checkHelper.checkOwner,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const projectId = req.body.project_id;
      const taskTitle = req.body.task_title;
      const taskState = req.body.task_state;
      const taskAssigneeId = req.body.task_assignee_id;
      const taskReviewerId = req.body.task_reviewer_id;
      const taskDueDate = req.body.task_due_date;
      const taskDescription = req.body.task_description;

      // check assignee and reviewer id
      const checkProjectMemberQuery = queries.queryList.CHECK_PROJECT_MEMBER_QUERY;
      const values1 = [projectId, taskAssigneeId];
      const queryResp1 = await dbConnection.dbQuery(checkProjectMemberQuery, values1);
      if (queryResp1.rows.length === 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: taskAssigneeId,
              msg: 'assignee is not partner in the project',
              path: 'task_assignee_id',
              location: 'body',
            },
          ],
        });
      }
      if (taskReviewerId != null) {
        const values2 = [projectId, taskReviewerId];
        const queryResp2 = await dbConnection.dbQuery(checkProjectMemberQuery, values2);
        if (queryResp2.rows.length === 0) {
          return res.status(400).json({
            errors: [
              {
                type: 'field',
                value: taskReviewerId,
                msg: 'reviewer is not partner in the project',
                path: 'task_reviewer_id',
                location: 'body',
              },
            ],
          });
        }
      }

      // check due date to be today or in the coming days
      const today = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
      const dueDate = `${taskDueDate.getFullYear()}-${taskDueDate.getMonth()}-${taskDueDate.getDate()}`;
      if (dueDate < today) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: taskDueDate,
              msg: 'task due date must be in the future',
              path: 'task_due_date',
              location: 'body',
            },
          ],
        });
      }

      const addTaskQuery = queries.queryList.ADD_TASK_QUERY;
      const values3 = [projectId, taskTitle, taskState, taskAssigneeId, taskReviewerId,
        taskDueDate, taskDescription];
      await dbConnection.dbQuery(addTaskQuery, values3);

      return res.sendStatus(201);
    } catch {
      return res.sendStatus(500);
    }
  },
];

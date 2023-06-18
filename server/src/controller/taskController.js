const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const checkHelper = require('../middlewares/checkHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

exports.task_list_get = [
  authHelper.authenticateToken,
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const getProjectTasksQuery = queries.queryList.GET_PROJECT_TASKS_QUERY;
      const values = [projectId];
      const queryResp = await dbConnection.dbQuery(getProjectTasksQuery, values);

      req.tasks = queryResp.rows;

      next();
    } catch {
      return res.sendStatus(500);
    }
  },
  checkHelper.checkMember,
  (req, res) => res.status(200).json(req.tasks),
];

exports.task_detail_get = [
  authHelper.authenticateToken,
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const getTaskDetailQuery = queries.queryList.GET_TASK_DETAIL_QUERY;
      const values = [taskId];
      const queryResp = await dbConnection.dbQuery(getTaskDetailQuery, values);
      if (queryResp.rows.length === 0) return res.sendStatus(404);
      const task = queryResp.rows[0]; // must have length = 1

      req.task = task;
      req.projectId = task.project_id;

      next();
    } catch {
      return res.sendStatus(500);
    }
  },
  checkHelper.checkMember,
  (req, res) => res.status(200).json(req.task),
];

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

      if (taskDueDate != null) {
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
      }

      const addTaskQuery = queries.queryList.ADD_TASK_QUERY;
      const values3 = [projectId, taskTitle, taskState, taskAssigneeId, taskReviewerId,
        taskDueDate, taskDescription];
      await dbConnection.dbQuery(addTaskQuery, values3);

      // get the inserted data
      const queryResp3 = await dbConnection.dbQuery(
        queries.queryList.GET_LAST_INSERTED_TASK_DETAIL_QUERY,
      );
      return res.status(201).json(queryResp3.rows);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.task_delete = [
  authHelper.authenticateToken,
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const getTaskDetailProjectQuery = queries.queryList.GET_TASK_DETAIL_PROJECT_QUERY;
      const values = [taskId];
      const queryResp = await dbConnection.dbQuery(getTaskDetailProjectQuery, values);
      if (queryResp.rows.length === 0) return res.sendStatus(404);
      req.projectId = queryResp.rows[0].project_id; // must have length = 1

      next();
    } catch {
      return res.sendStatus(500);
    }
  },
  checkHelper.checkOwner,
  async (req, res) => {
    try {
      const { taskId } = req.params;

      const deleteTaskQuery = queries.queryList.DELETE_TASK_QUERY;
      const values = [taskId];
      await dbConnection.dbQuery(deleteTaskQuery, values);

      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.task_update_patch = [
  body('task_state')
    .isIn(['New Request', 'In Progress', 'On Review', 'Complete'])
    .escape()
    .withMessage('Invalid value'),
  authHelper.authenticateToken,
  checkHelper.checkAccessTaskUpdate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { taskId } = req.params;
      const newState = req.body.task_state;

      const changeTaskState = queries.queryList.CHANGE_TASK_STATE_QUERY;
      const values = [newState, taskId];
      await dbConnection.dbQuery(changeTaskState, values);

      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.task_comment_create_post = [
  body('comment_content')
    .isLength({ min: 1 })
    .escape()
    .withMessage('comment content must be specified'),
  authHelper.authenticateToken,
  checkHelper.checkAccessTaskUpdate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { userId } = req;
      const { taskId } = req.params;
      const commentContent = req.body.comment_content;

      const addCommentQuery = queries.queryList.ADD_COMMENT_QUERY;
      const values = [userId, taskId, commentContent];
      await dbConnection.dbQuery(addCommentQuery, values);

      return res.status(201).json({ comment_content: commentContent });
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.task_comment_list_get = [
  authHelper.authenticateToken,
  checkHelper.checkAccessTaskUpdate,
  async (req, res) => {
    try {
      const { taskId } = req.params;

      const getTaskCommentsQuery = queries.queryList.GET_TASK_COMMENTS_QUERY;
      const values = [taskId];
      const queryResp = await dbConnection.dbQuery(getTaskCommentsQuery, values);

      return res.status(200).json(queryResp.rows);
    } catch {
      return res.sendStatus(500);
    }
  },
];

const dbConnection = require('../db/connection');
const queries = require('../db/queries');

// eslint-disable-next-line consistent-return
exports.checkOwner = async (req, res, next) => {
  const { userId } = req;
  const projectId = req.params.projectId ?? req.body.project_id ?? req.projectId;

  if (userId == null) return res.sendStatus(401);
  if (projectId == null) return res.sendStatus(403);

  const checkProjectOwner = queries.queryList.CHECK_PROJECT_OWNER_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectOwner, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

// eslint-disable-next-line consistent-return
exports.checkMember = async (req, res, next) => {
  const { userId } = req;
  const projectId = req.params.projectId ?? req.body.project_id ?? req.projectId;

  if (userId == null) return res.sendStatus(401);
  if (projectId == null) return res.sendStatus(403);

  const checkProjectMemberQuery = queries.queryList.CHECK_PROJECT_MEMBER_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectMemberQuery, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

// eslint-disable-next-line consistent-return
exports.checkAccessTaskUpdate = async (req, res, next) => {
  const { userId } = req;
  const taskId = req.params.taskId ?? req.body.task_id ?? req.taskId;

  if (userId == null) return res.sendStatus(401);
  if (taskId == null) return res.sendStatus(403);

  const getTaskUpdatersQuery = queries.queryList.GET_TASK_UPDATERS_QUERY;
  const values = [taskId];
  const queryResp1 = await dbConnection.dbQuery(getTaskUpdatersQuery, values);
  const updaters = queryResp1.rows[0];

  if (Number(userId) !== updaters.user_id && Number(userId) !== updaters.task_assignee_id
    && Number(userId) !== updaters.task_reviewer_id) return res.sendStatus(403);

  next();
};

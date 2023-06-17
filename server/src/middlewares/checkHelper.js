const dbConnection = require('../db/connection');
const queries = require('../db/queries');

// eslint-disable-next-line consistent-return
exports.checkOwner = async (req, res, next) => {
  const { userId } = req;
  const { projectId } = req.params;

  if (userId == null || projectId == null) return res.sendStatus(401);

  const checkProjectOwner = queries.queryList.CHECK_PROJECT_OWNER_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectOwner, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

// eslint-disable-next-line consistent-return
exports.checkMember = async (req, res, next) => {
  const { userId } = req;
  const { projectId } = req.params;

  if (userId == null || projectId == null) return res.sendStatus(401);

  const checkProjectMemberQuery = queries.queryList.CHECK_PROJECT_MEMBER_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectMemberQuery, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

// eslint-disable-next-line consistent-return
exports.checkAssignee = async (req, res, next) => {
  const { userId } = req;
  const { projectId } = req.params;

  if (userId == null || projectId == null) return res.sendStatus(401);

  const checkProjectAssigneeQuery = queries.queryList.CHECK_PROJECT_ASSIGNEE_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectAssigneeQuery, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

// eslint-disable-next-line consistent-return
exports.checkReviewer = async (req, res, next) => {
  const { userId } = req;
  const { projectId } = req.params;

  if (userId == null || projectId == null) return res.sendStatus(401);

  const checkProjectReviewerQuery = queries.queryList.CHECK_PROJECT_REVIEWER_QUERY;
  const values = [projectId, userId];
  const queryResp = await dbConnection.dbQuery(checkProjectReviewerQuery, values);

  if (queryResp.rows.length === 0) return res.sendStatus(403);
  next();
};

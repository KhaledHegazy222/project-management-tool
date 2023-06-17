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

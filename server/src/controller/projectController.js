const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

exports.project_list_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req;

      const getProjectListQuery = queries.queryList.GET_PROJECT_LIST_QUERY;
      const values = [userId];
      const queryResp = await dbConnection.dbQuery(getProjectListQuery, values);

      return res.status(200).json(queryResp.rows);
    } catch {
      return res.status(500);
    }
  },
];

exports.project_create_post = [
  body('projectTitle')
    .isLength({ min: 1 })
    .escape()
    .withMessage('projectTitle can not be empty'),
  authHelper.authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { userId } = req;
      const { projectTitle } = req.body;

      await dbConnection.dbQuery('BEGIN');
      const addProjectQuery = queries.queryList.ADD_PROJECT_QUERY;
      const values1 = [projectTitle];
      await dbConnection.dbQuery(addProjectQuery, values1);

      const addProjectUserRelationshipQuery = queries.queryList.ADD_PROJECT_USER_RELATIONSHIP;
      const values2 = [userId];
      await dbConnection.dbQuery(addProjectUserRelationshipQuery, values2);
      await dbConnection.dbQuery('COMMIT');

      return res.sendStatus(201);
    } catch {
      await dbConnection.dbQuery('ROLLBACK');
      return res.status(500);
    }
  },
];

exports.project_detail_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req;
      const { projectId } = req.params;

      const getProjectUserStateQuery = queries.queryList.GET_PROJECT_USER_STATE_QUERY;
      const values1 = [projectId, userId];
      const queryResp1 = await dbConnection.dbQuery(getProjectUserStateQuery, values1);

      if (queryResp1.rows.length === 0) return res.sendStatus(403);

      const getProjectDetailQuery = queries.queryList.GET_PROJECT_DETAIL_QUERY;
      const values2 = [projectId];
      const queryResp2 = await dbConnection.dbQuery(getProjectDetailQuery, values2);

      return res.status(200).json(queryResp2.rows[0]); // must has one row
    } catch {
      return res.status(500);
    }
  },
];

const authHelper = require('../middlewares/authHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');
const { body, validationResult } = require('express-validator');

exports.project_list_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { user_id } = req;

      const getProjectListQuery = queries.queryList.GET_PROJECT_LIST_QUERY;
      const values = [user_id];
      const queryResp = await dbConnection.dbQuery(getProjectListQuery, values);

      return res.status(200).send(queryResp.rows);
    } catch {
      return res.status(500).send({ error: 'Failed to get project list' });
    }
  }
];

exports.project_create_post = [
  body('project_title')
    .isLength({ min: 1 })
    .escape()
    .withMessage('project_title can not be empty'),
  authHelper.authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { user_id } = req;
      const { project_title } = req.body;

      await dbConnection.dbQuery('BEGIN');
      const addProjectQuery = queries.queryList.ADD_PROJECT_QUERY;
      const values1 = [project_title];
      await dbConnection.dbQuery(addProjectQuery, values1);

      const addProjectUserRelationshipQuery = queries.queryList.ADD_PROJECT_USER_RELATIONSHIP;
      const values2 = [user_id];
      await dbConnection.dbQuery(addProjectUserRelationshipQuery, values2);
      await dbConnection.dbQuery('COMMIT');

      return res.sendStatus(201);
    } catch {
      await dbConnection.dbQuery('ROLLBACK');
      return res.status(500).send({ error: 'Failed to create new project' });
    }
  }
];

exports.project_detail_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { user_id } = req;
      const { project_id } = req.params;

      const getProjectUserStateQuery = queries.queryList.GET_PROJECT_USER_STATE_QUERY;
      const values1 = [project_id, user_id];
      const queryResp1 = await dbConnection.dbQuery(getProjectUserStateQuery, values1);

      if (queryResp1.rows.length === 0)
        return res.sendStatus(403);

      const getProjectDetailQuery = queries.queryList.GET_PROJECT_DETAIL_QUERY;
      const values2 = [project_id];
      const queryResp2 = await dbConnection.dbQuery(getProjectDetailQuery, values2);

      return res.status(200).send(queryResp2.rows);
    } catch {
      return res.status(500).send({ error: 'Failed to get project list' });
    }
  }
];

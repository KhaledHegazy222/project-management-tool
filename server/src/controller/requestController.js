const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

exports.user_request_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req;

      const getMemberRequestsQuery = queries.queryList.GET_MEMBER_REQUESTS_QUERY;
      const values = [userId];
      const queryResp = await dbConnection.dbQuery(getMemberRequestsQuery, values);

      return res.status(200).json(queryResp.rows);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.user_request_seen_patch = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req;

      const updateMemberRequestsSeenQuery = queries.queryList.UPDATE_MEMBER_REQUESTS_SEEN_QUERY;
      const values = [userId];
      await dbConnection.dbQuery(updateMemberRequestsSeenQuery, values);

      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.user_cancel_post = [
  body('project_id')
    .trim()
    .isInt()
    .withMessage('Must be a integer number'),
  authHelper.authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { userId } = req;
      const projectId = req.body.project_id;

      const getMemberRequestsQuery = queries.queryList.GET_MEMBER_REQUEST_QUERY;
      const values = [projectId, userId];
      const queryResp = await dbConnection.dbQuery(getMemberRequestsQuery, values);

      if (queryResp.rows.length === 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: projectId,
              msg: 'request is not exist',
              path: 'project_id',
              location: 'body',
            },
          ],
        });
      }

      const deleteMemberRequestsQuery = queries.queryList.DELETE_MEMBER_REQUEST_QUERY;
      await dbConnection.dbQuery(deleteMemberRequestsQuery, values);

      return res.sendStatus(201);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.user_accept_post = [
  body('project_id')
    .trim()
    .isInt()
    .withMessage('Must be a integer number'),
  authHelper.authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { userId } = req;
      const projectId = req.body.project_id;

      const getMemberRequestsQuery = queries.queryList.GET_MEMBER_REQUEST_QUERY;
      const values = [projectId, userId];
      const queryResp = await dbConnection.dbQuery(getMemberRequestsQuery, values);

      if (queryResp.rows.length === 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: projectId,
              msg: 'request is not exist',
              path: 'project_id',
              location: 'body',
            },
          ],
        });
      }

      await dbConnection.dbQuery('BEGIN');
      const addMemberQuery = queries.queryList.ADD_MEMBER_QUERY;
      await dbConnection.dbQuery(addMemberQuery, values);

      const deleteMemberRequestsQuery = queries.queryList.DELETE_MEMBER_REQUEST_QUERY;
      await dbConnection.dbQuery(deleteMemberRequestsQuery, values);
      await dbConnection.dbQuery('COMMIT');

      return res.sendStatus(201);
    } catch {
      await dbConnection.dbQuery('ROLLBACK');
      return res.sendStatus(500);
    }
  },
];

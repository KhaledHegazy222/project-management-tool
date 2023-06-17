const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const checkHelper = require('../middlewares/checkHelper');
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
  body('project_title')
    .isLength({ min: 1 })
    .escape()
    .withMessage('projectTitle can not be empty'),
  authHelper.authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { userId } = req;
      const projectTitle = req.body.project_title;

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

exports.project_member_post = [
  body('member_mail')
    .isEmail()
    .escape()
    .withMessage('must be email'),
  body('member_state')
    .isIn(['REVIEWER', 'ASSIGNEE']),
  authHelper.authenticateToken,
  checkHelper.checkOwner,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { projectId } = req.params;
      const memberMail = req.body.member_mail;
      const memberState = req.body.member_state;

      // get member id
      const getUserIdQuery = queries.queryList.GET_USER_ID_QUERY;
      const values1 = [memberMail];
      const queryResp1 = await dbConnection.dbQuery(getUserIdQuery, values1);
      const memberId = queryResp1.rows[0].user_id;

      // check if request already exist
      const getMemberRequestQuery = queries.queryList.GET_MEMBER_REQUEST_QUERY;
      const values2 = [projectId, memberId, memberState];
      const queryResp2 = await dbConnection.dbQuery(getMemberRequestQuery, values2);

      if (queryResp2.rows.length !== 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: memberState,
              msg: 'request already exist',
              path: 'member_state',
              location: 'body',
            },
          ],
        });
      }

      // check if member already exist
      const getMemberQuery = queries.queryList.GET_MEMBER_QUERY;
      const queryResp3 = await dbConnection.dbQuery(getMemberQuery, values2);

      if (queryResp3.rows.length !== 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: memberMail,
              msg: 'member has been assigned to this project before',
              path: 'member_mail',
              location: 'body',
            },
          ],
        });
      }

      // make query
      const addMemberRequestQuery = queries.queryList.ADD_MEMBER_REQUEST_QUERY;
      await dbConnection.dbQuery(addMemberRequestQuery, values2);

      return res.sendStatus(201);
    } catch {
      return res.status(500);
    }
  },
];

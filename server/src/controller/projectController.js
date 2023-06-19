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
      return res.sendStatus(500);
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

      // get the inserted data
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_LAST_INSERTED_PROJECT_DETAIL_QUERY,
      );
      return res.status(201).json(queryResp.rows);
    } catch {
      await dbConnection.dbQuery('ROLLBACK');
      return res.sendStatus(500);
    }
  },
];

exports.project_detail_get = [
  authHelper.authenticateToken,
  checkHelper.checkMember,
  async (req, res) => {
    try {
      const { projectId } = req.params;

      const getProjectDetailQuery = queries.queryList.GET_PROJECT_DETAIL_QUERY;
      const values2 = [projectId];
      const queryResp2 = await dbConnection.dbQuery(getProjectDetailQuery, values2);
      if (queryResp2.rows.length === 0) return res.sendStatus(404);

      return res.status(200).json(queryResp2.rows[0]); // must has one row
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.project_member_post = [
  body('members_mail')
    .isArray({ min: 1 }),
  body('members_mail.*')
    .not()
    .isArray()
    .isEmail()
    .escape()
    .withMessage('some emails not valid'),
  authHelper.authenticateToken,
  checkHelper.checkOwner,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { projectId } = req.params;
      const membersMail = req.body.members_mail;

      const nonValidMails = [];
      const validMails = [];
      const validMailsId = [];
      await Promise.all(membersMail.map(async (memberMail) => {
        // get member id
        const getUserIdQuery = queries.queryList.GET_USER_ID_QUERY;
        const values1 = [memberMail];
        const queryResp1 = await dbConnection.dbQuery(getUserIdQuery, values1);
        if (queryResp1.rows.length === 0) {
          nonValidMails.push({
            memberMail,
            msg: 'mail is not exist',
          });
          return;
        }
        const memberId = queryResp1.rows[0].user_id;

        // check if request already exist
        const getMemberRequestQuery = queries.queryList.GET_MEMBER_REQUEST_QUERY;
        const values2 = [projectId, memberId];
        const queryResp2 = await dbConnection.dbQuery(getMemberRequestQuery, values2);

        if (queryResp2.rows.length !== 0) {
          nonValidMails.push({
            memberMail,
            msg: 'request already exists',
          });
          return;
        }

        // check if member already exist
        const checkProjectMemberQuery = queries.queryList.CHECK_PROJECT_MEMBER_QUERY;
        const queryResp3 = await dbConnection.dbQuery(checkProjectMemberQuery, values2);

        if (queryResp3.rows.length !== 0) {
          nonValidMails.push({
            memberMail,
            msg: 'user already exists in this project',
          });
          return;
        }

        validMails.push(memberMail);
        validMailsId.push(memberId);
      }));

      if (nonValidMails.length !== 0) {
        return res.status(400).json({
          non_valid_mails: nonValidMails,
          valid_mails: validMails,
        });
      }

      // make query
      dbConnection.dbQuery('BEGIN');
      await Promise.all(validMailsId.map((memberId) => {
        const addMemberRequestQuery = queries.queryList.ADD_MEMBER_REQUEST_QUERY;
        const values = [projectId, memberId];
        return dbConnection.dbQuery(addMemberRequestQuery, values);
      }));
      dbConnection.dbQuery('COMMIT');

      return res.sendStatus(201);
    } catch {
      dbConnection.dbQuery('ROLLBACK');
      return res.sendStatus(500);
    }
  },
];

exports.project_member_get = [
  authHelper.authenticateToken,
  checkHelper.checkMember,
  async (req, res) => {
    try {
      const { projectId } = req.params;

      // members who accepted invitations
      const getMembersQuery = queries.queryList.GET_MEMBERS_QUERY;
      // members who didn't accept invitation yet
      const getRequestProjectMembersQuery = queries.queryList.GET_REQUEST_PROJECT_MEMBERS_QUERY;
      const values = [projectId];

      const [queryResp1, queryResp2] = await Promise.all([
        dbConnection.dbQuery(getMembersQuery, values),
        dbConnection.dbQuery(getRequestProjectMembersQuery, values),
      ]);

      return res.status(200).json({
        accepted: queryResp1.rows,
        invited: queryResp2.rows,
      });
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.project_delete = [
  authHelper.authenticateToken,
  checkHelper.checkOwner,
  async (req, res) => {
    try {
      const { projectId } = req.params;

      const deleteProjectQuery = queries.queryList.DELETE_PROJECT_QUERY;
      const values = [projectId];
      await dbConnection.dbQuery(deleteProjectQuery, values);

      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  },
];

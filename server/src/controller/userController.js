const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
const verificationMailHelper = require('../middlewares/verificationMailHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

exports.user_signup_post = [
  body('mail')
    .isEmail()
    .escape()
    .withMessage('must be email'),
  body('password')
    .isLength({ min: 6 })
    .escape()
    .withMessage('password must be at least 6 length'),
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('first name must be specified.'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('last name must be specified.'),
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const {
        mail, password,
      } = req.body;
      const firstName = req.body.first_name;
      const lastName = req.body.last_name;

      const getUserQuery = queries.queryList.GET_USER_QUERY;
      const values1 = [mail];
      const queryResp = await dbConnection.dbQuery(getUserQuery, values1);
      if (queryResp.rows.length !== 0) {
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              value: mail,
              msg: 'mail already exist',
              path: 'mail',
              location: 'body',
            },
          ],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await dbConnection.dbQuery('BEGIN');
      const createUserQuery = queries.queryList.CREATE_USER_QUERY;
      const values2 = [mail, hashedPassword, firstName, lastName];
      await dbConnection.dbQuery(createUserQuery, values2);

      const addVerificationIdQuery = queries.queryList.ADD_VERIFICATION_ID_QUERY;
      const values3 = [uuidv4()];
      await dbConnection.dbQuery(addVerificationIdQuery, values3);
      await dbConnection.dbQuery('COMMIT');

      req.mail = mail;

      next();
    } catch (err) {
      await dbConnection.dbQuery('ROLLBACK');
      return res.sendStatus(500);
    }
  },
  verificationMailHelper,
  (req, res) => res.sendStatus(201),
];

exports.user_login_post = [
  body('mail')
    .isEmail()
    .escape()
    .withMessage('email format not correct'),
  body('password')
    .escape(),
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { mail, password } = req.body;

      const getUserQuery = queries.queryList.GET_USER_QUERY;
      const values = [mail];
      const queryResp = await dbConnection.dbQuery(getUserQuery, values);

      if (queryResp.rows.length === 0) return res.sendStatus(404);

      const user = queryResp.rows[0];

      if (!user.active) return res.status(400).json({ errors: [{ msg: 'Account is not activated' }] });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) return res.sendStatus(401);
        return res.status(200).json({
          token: authHelper.generateAccessToken(user.user_id.toString()),
        });
      });
    } catch (err) {
      return res.sendStatus(500);
    }
  },
];

exports.user_details_get = [
  authHelper.authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req;
      const getUserByIdQuery = queries.queryList.GET_USER_BY_ID_QUERY;
      const values = [userId];
      const queryResp = await dbConnection.dbQuery(getUserByIdQuery, values);
      if (queryResp.rows.length === 0) return res.sendStatus(404);

      return res.status(200).json(queryResp.rows[0]);
    } catch {
      return res.sendStatus(500);
    }
  },
];

exports.user_verify_post = async (req, res) => {
  try {
    const { verificationId } = req.params;

    const getUnverifiedUserIdQuery = queries.queryList.GET_UNVERIFIED_USER_ID_QUERY;
    const value1 = [verificationId];
    const queryResp = await dbConnection.dbQuery(getUnverifiedUserIdQuery, value1);
    if (queryResp.rows.length === 0) return res.sendStatus(400);

    const userId = queryResp.rows[0].user_id;

    await dbConnection.dbQuery('BEGIN');
    const verifyUserQuery = queries.queryList.VERIFY_USER_QUERY;
    const value2 = [userId];
    await dbConnection.dbQuery(verifyUserQuery, value2);

    const deleteUserVerificationIdsQuery = queries.queryList.DELETE_USER_VERIFICATION_IDS_QUERY;
    await dbConnection.dbQuery(deleteUserVerificationIdsQuery, value2);
    await dbConnection.dbQuery('COMMIT');

    return res.sendStatus(200);
  } catch {
    await dbConnection.dbQuery('ROLLBACK');
    return res.sendStatus(500);
  }
};

exports.user_send_verification_post = [
  body('mail')
    .isEmail()
    .escape()
    .withMessage('must be email'),
  verificationMailHelper,
  (req, res) => res.sendStatus(200),
];

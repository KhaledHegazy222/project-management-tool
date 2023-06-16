const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const authHelper = require('../middlewares/authHelper');
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
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('first name must be specified.'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('last name must be specified.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const {
        mail, password, firstName, lastName,
      } = req.body;

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

      const createUserQuery = queries.queryList.CREATE_USER_QUERY;
      const values2 = [mail, hashedPassword, firstName, lastName];
      await dbConnection.dbQuery(createUserQuery, values2);

      return res.sendStatus(201);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
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

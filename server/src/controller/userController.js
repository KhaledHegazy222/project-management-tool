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

      const hashedPassword = await bcrypt.hash(password, 10);

      const values = [mail, hashedPassword, firstName, lastName];
      const createUserQuery = queries.queryList.CREATE_USER_QUERY;
      await dbConnection.dbQuery(createUserQuery, values);

      return res.status(201).send('Successfully signed up');
    } catch (err) {
      console.log('Error: ', err);
      return res.status(500).send({ error: 'Failed to sign up' });
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
      const values = [mail];
      const getUserQuery = queries.queryList.GET_USER_QUERY;
      const queryResp = await dbConnection.dbQuery(getUserQuery, values);

      if (queryResp.rows.length === 0) return res.status(404).json({ message: 'mail is not exist' });
      if (queryResp.rows.length > 1) return res.status(500).send({ error: 'Failed to log in' });

      const user = queryResp.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) return res.status(401).json({ message: 'Incorrect password' });
        return res.json({
          message: 'success',
          token: authHelper.generateAccessToken(user.user_id.toString()),
        });
      });
    } catch (err) {
      console.log('Error: ', err);
      return res.status(500).send({ error: 'Failed to log in' });
    }
  },
];

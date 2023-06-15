const authHelper = require('../middlewares/authHelper');
const dbConnection = require('../db/connection');
const queries = require('../db/queries');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

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
    .withMessage('first name must be specified.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { mail, password, first_name, last_name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const values = [mail, hashedPassword, first_name, last_name];
      const createUserQuery = queries.queryList.CREATE_USER_QUERY;
      await dbConnection.dbQuery(createUserQuery, values);

      return res.status(201).send('Successfully signed up');
    } catch (err) {
      console.log('Error: ', err);
      return res.status(500).send({ error: 'Failed to sign up' });
    }
  }
];

exports.user_login_post = [
  body('mail')
    .isEmail()
    .escape()
    .withMessage('must be email'),
  body('password')
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { mail, password } = req.body;
      const values = [mail];
      const getUserQuery = queries.queryList.GET_USER_QUERY;
      const queryResp = await dbConnection.dbQuery(getUserQuery, values);

      if (queryResp.rows.length === 0)
        return res.status(404).json({ message: 'mail is not exist' });
      else if (queryResp.rows.length > 1) // mustn't happen
        return res.status(500).send({ error: 'Failed to log in' });

      const user = queryResp.rows[0];
      console.log(user);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result)
          return res.status(401).json({ message: 'Incorrect password' });
        return res.json({
          message: 'success',
          token: authHelper.generateAccessToken(user.user_id.toString()),
        });
      });
    } catch (err) {
      console.log('Error: ', err);
      return res.status(500).send({ error: 'Failed to log in' });
    }
  }
];